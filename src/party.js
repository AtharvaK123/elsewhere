import { createClient } from '@supabase/supabase-js';
import { normalizeAppearance } from './avatar.js';

export function cleanPeer(payload, id) {
  if (!payload || typeof payload.name !== 'string' || !payload.position) return null;
  const {lat,lon}=payload.position;
  if (!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>85||Math.abs(lon)>180) return null;
  const y=Number.isFinite(payload.position.y)?Math.max(0,Math.min(1500,payload.position.y)):0;
  return {id,name:payload.name.slice(0,24),appearance:normalizeAppearance(payload.appearance),position:{lat,lon,y},heading:Number.isFinite(payload.heading)?payload.heading:0,moving:payload.moving===true,flying:payload.flying===true,placeId:String(payload.placeId||'').slice(0,100)};
}
export class Party {
  constructor({onPeers=()=>{},onChat=()=>{},onStatus=()=>{},onTravel=()=>{},onProfile=()=>{},onCloud=()=>{},onAccount=()=>{}}) {
    this.id=crypto.randomUUID();this.peers=new Map();this.seen=new Set();Object.assign(this,{onPeers,onChat,onStatus,onTravel,onProfile,onCloud,onAccount});this.remoteReady=false;this.state={};this.generation=0;this.cloudStatus='local';
  }
  // Accounts are Supabase email + password users. Without a session the player is a guest:
  // their explorer stays on this device and online play waits until they sign in.
  async configure(config,profile) {
    const signature=(config.supabaseUrl||'')+'|'+(config.supabaseKey||'');
    if(profile)this.profile=profile;
    if(signature!==this.signature){
      this.signature=signature;
      if(this.client){this.authListener?.unsubscribe();this.client.auth.stopAutoRefresh();await this.client.removeAllChannels();this.client=null;this.user=null;}
      if(!config.supabaseUrl||!config.supabaseKey){this.cloudStatus='local';this.onCloud('local');this.onAccount(null);return false;}
      const client=createClient(config.supabaseUrl,config.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},global:{fetch:(url,options={})=>fetch(url,{...options,signal:AbortSignal.any([...(options.signal?[options.signal]:[]),AbortSignal.timeout(10000)])})},realtime:{params:{eventsPerSecond:10}}});
      this.client=client;
      // Supabase calls must not run inside this callback, so react on the next tick.
      this.authListener=client.auth.onAuthStateChange((event,next)=>setTimeout(()=>{
        if(this.client!==client)return;
        if(next)client.realtime.setAuth(next.access_token);
        if(event==='SIGNED_IN'&&next&&next.user.id!==this.user?.id)this.adopt(client,next).catch(error=>{this.cloudStatus='error';this.lastError=error.message;this.onCloud('error',error.message);});
        else if(event==='SIGNED_OUT'&&this.user)this.signedOut();
      },0)).data.subscription;
    }
    if(!this.client)return false;
    if(this.user&&this.cloudStatus==='ready')return true;
    const client=this.client;
    return this.configurePromise??=(async()=>{
      try{this.cloudStatus='connecting';this.onCloud('connecting');const {data:{session}}=await client.auth.getSession();if(this.client!==client)return false;return session?await this.adopt(client,session):this.signedOut();}
      catch(error){this.user=null;this.cloudStatus='error';this.lastError=error.message;this.onCloud('error',error.message);return false;}
      finally{this.configurePromise=null;}
    })();
  }
  // Loads the account's explorer, or saves the local one as its first profile.
  async adopt(client,session){
    this.user=session.user;await client.realtime.setAuth(session.access_token);
    const result=await client.from('elsewhere_profiles').select('name,appearance').eq('id',this.user.id).maybeSingle();
    if(result.error)throw result.error;
    if(result.data)this.onProfile({name:result.data.name,appearance:normalizeAppearance(result.data.appearance)});
    else{const profile=this.profile||{name:'Explorer'},name=String(session.user.user_metadata?.name||profile.name).trim().slice(0,24)||'Explorer';
      const saved=await client.from('elsewhere_profiles').upsert({id:this.user.id,name,appearance:normalizeAppearance(profile.appearance),updated_at:new Date().toISOString()});if(saved.error)throw saved.error;
      if(name!==profile.name)this.onProfile({name,appearance:normalizeAppearance(profile.appearance)});}
    this.cloudStatus='ready';this.onCloud('ready');this.onAccount(this.user);return true;
  }
  signedOut(){this.user=null;this.cloudStatus='signed-out';this.onCloud('signed-out');this.onAccount(null);return false;}
  get account(){return this.cloudStatus==='ready'&&this.user?{id:this.user.id,email:this.user.email}:null;}
  // Returns 'signed-in', or 'confirm' when the project requires email confirmation first.
  async signUp({email,password,name}){
    if(!this.client)throw new Error('Accounts are not set up yet.');
    const {data,error}=await this.client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname,data:{name:String(name||'').slice(0,24)}}});
    if(error)throw error;
    // An existing address comes back without identities; never reveal it, just ask them to sign in.
    if(data.user&&!data.user.identities?.length)throw new Error('Check your email, or sign in if you already have an account.');
    if(data.session){await this.adopt(this.client,data.session);return 'signed-in';}
    return 'confirm';
  }
  async signIn({email,password}){
    if(!this.client)throw new Error('Accounts are not set up yet.');
    const {data,error}=await this.client.auth.signInWithPassword({email,password});if(error)throw error;
    await this.adopt(this.client,data.session);return true;
  }
  async signOut(){
    if(!this.client)return;
    await this.disconnect();const {error}=await this.client.auth.signOut();if(error)throw error;this.signedOut();
  }
  async saveProfile(profile) {
    if(!this.client||this.cloudStatus!=='ready')return false;
    const {error}=await this.client.from('elsewhere_profiles').upsert({id:this.user.id,name:profile.name,appearance:normalizeAppearance(profile.appearance),updated_at:new Date().toISOString()});
    if(error)throw error;this.update(profile);if(this.remoteReady)await this.channel.track(this.state);return true;
  }
  async connect(room,config,profile) {
    await this.disconnect();const generation=++this.generation;
    this.room=room;this.state={...profile,id:this.id,name:profile.name.slice(0,24),appearance:normalizeAppearance(profile.appearance)};
    if('BroadcastChannel' in window){this.local=new BroadcastChannel('elsewhere:'+room);this.local.onmessage=e=>this.receive(e.data);}
    this.send('hello',this.state);this.onStatus('local');
    this.interval=setInterval(()=>{
      this.send('presence',this.state);const now=Date.now();for(const[id,p]of this.peers)if(now-p.lastSeen>16000)this.peers.delete(id);this.emitPeers();
      if(this.remoteReady){this.channel.track(this.state);this.persistPosition();}
    },5000);
    // Keep local play responsive while authentication and database checks complete.
    this.connectRemote(room,config,profile,generation);
  }
  async connectRemote(room,config,profile,generation) {
    if(!await this.configure(config,profile)||generation!==this.generation)return;
    try {
      const {data:roomId,error}=await this.client.rpc('elsewhere_join_room',{p_code:room});if(error)throw error;
      if(generation!==this.generation)return;this.roomId=roomId;
      const channel=this.client.channel('elsewhere:'+roomId,{config:{private:true,presence:{key:this.id},broadcast:{self:false,ack:true}}});this.channel=channel;
      channel.on('broadcast',{event:'world'},({payload})=>this.receive(payload));
      channel.on('presence',{event:'sync'},()=>{for(const entries of Object.values(channel.presenceState()))for(const peer of entries)this.receive({type:'presence',sender:peer.id,payload:peer});});
      channel.subscribe(async status=>{
        if(generation!==this.generation)return;
        if(status==='SUBSCRIBED'){this.remoteReady=true;this.onStatus('online');await channel.track(this.state);this.send('hello',this.state);this.persistPosition();}
        else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status)){this.remoteReady=false;this.onStatus('error');}
      });
    }catch(error){if(generation===this.generation){this.lastError=error.message;this.onStatus('error');this.onCloud('error',error.message);}}
  }
  async persistPosition(){
    if(!this.user||!this.roomId||!this.state.position||this.persisting)return;
    this.persisting=true;
    try{const {lat,lon}=this.state.position;const {error}=await this.client.from('elsewhere_sessions').upsert({session_id:this.id,user_id:this.user.id,room_id:this.roomId,latitude:lat,longitude:lon,heading:this.state.heading||0,updated_at:new Date().toISOString()});if(error&&!this.positionError){this.positionError=true;this.onCloud('error',error.message);}}finally{this.persisting=false;}
  }
  receive(message){
    if(!message||message.sender===this.id||typeof message.sender!=='string'||message.sender.length>80)return;
    if(message.messageId){if(this.seen.has(message.messageId))return;this.seen.add(message.messageId);if(this.seen.size>300)this.seen.delete(this.seen.values().next().value);}
    const {type,payload,sender}=message;
    if(['hello','presence','move'].includes(type)){
      const peer=cleanPeer(payload,sender);if(!peer||(!this.peers.has(sender)&&this.peers.size>=100))return;
      this.peers.set(sender,{...peer,lastSeen:Date.now()});this.emitPeers();if(type==='hello')this.send('presence',this.state);
    }else if(type==='leave'){this.peers.delete(sender);this.emitPeers();}
    else if(type==='chat'&&typeof payload?.text==='string')this.onChat({name:String(payload.name||'Explorer').slice(0,24),text:payload.text.slice(0,300)});
    else if(type==='travel'&&payload&&Number.isFinite(payload.lat)&&Math.abs(payload.lat)<=85&&Number.isFinite(payload.lon)&&Math.abs(payload.lon)<=180)this.onTravel({...payload,id:String(payload.id).slice(0,100),name:String(payload.name).slice(0,100),region:String(payload.region||'').slice(0,100),radius:900});
  }
  emitPeers(){this.onPeers([...this.peers.values()]);}
  send(type,payload){const message={messageId:crypto.randomUUID(),sender:this.id,type,payload};this.local?.postMessage(message);if(this.remoteReady)this.channel?.send({type:'broadcast',event:'world',payload:message});}
  update(state){Object.assign(this.state,state);if(this.room)this.send('move',this.state);}
  chat(text){const msg={name:this.state.name,text:text.slice(0,300)};this.send('chat',msg);this.onChat({...msg,name:'You'});}
  async disconnect(){
    ++this.generation;if(this.room)this.send('leave',{});this.room=null;clearInterval(this.interval);this.local?.close();this.local=null;this.remoteReady=false;
    const oldChannel=this.channel;this.channel=null;if(oldChannel)this.client?.removeChannel(oldChannel);
    if(this.client&&this.roomId)this.client.from('elsewhere_sessions').delete().eq('session_id',this.id).then(()=>{});
    this.roomId=null;this.peers.clear();this.seen.clear();this.emitPeers();
  }
}
