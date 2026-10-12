import { createClient } from '@supabase/supabase-js';
export class Party {
  constructor({onPeers,onChat,onStatus,onTravel}) { this.id=crypto.randomUUID();this.peers=new Map();this.seen=new Set();this.onPeers=onPeers;this.onChat=onChat;this.onStatus=onStatus;this.onTravel=onTravel;this.remoteReady=false;this.state={}; }
  async connect(room,config,profile) {
    await this.disconnect();this.room=room;this.state={id:this.id,name:profile.name.slice(0,24),...profile};
    if('BroadcastChannel'in window){this.local=new BroadcastChannel(`elsewhere:${room}`);this.local.onmessage=e=>this.receive(e.data);}
    this.send('hello',this.state);this.interval=setInterval(()=>{this.send('presence',this.state);const now=Date.now();for(const[id,p]of this.peers)if(now-p.lastSeen>16000)this.peers.delete(id);this.emitPeers();},5000);
    this.onStatus('local');
    if(config.supabaseUrl&&config.supabaseKey){
      try{this.client=createClient(config.supabaseUrl,config.supabaseKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},realtime:{params:{eventsPerSecond:10}}});
        this.channel=this.client.channel(`elsewhere-${room}`,{config:{presence:{key:this.id},broadcast:{self:false}}});
        this.channel.on('broadcast',{event:'world'},({payload})=>this.receive(payload));
        this.channel.on('presence',{event:'sync'},()=>{for(const entries of Object.values(this.channel.presenceState()))for(const p of entries)this.receive({type:'presence',sender:p.id,payload:p});});
        this.channel.subscribe(async status=>{if(status==='SUBSCRIBED'){this.remoteReady=true;this.onStatus('online');await this.channel.track(this.state);this.send('hello',this.state);}else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status)){this.remoteReady=false;this.onStatus('error');}});
      }catch{this.onStatus('error');}
    }
  }
  receive(message){
    if(!message||message.sender===this.id||typeof message.sender!=='string'||message.sender.length>80)return;
    if(message.messageId){if(this.seen.has(message.messageId))return;this.seen.add(message.messageId);if(this.seen.size>300)this.seen.delete(this.seen.values().next().value);}
    const {type,payload,sender}=message;
    if(['hello','presence','move'].includes(type)&&payload&&typeof payload.name==='string'){
      const position=payload.position;
      if(position&&(!Number.isFinite(position.lat)||!Number.isFinite(position.lon)||Math.abs(position.lat)>85||Math.abs(position.lon)>180))return;
      this.peers.set(sender,{id:sender,name:payload.name.slice(0,24),placeId:String(payload.placeId||'').slice(0,100),position,lastSeen:Date.now()});this.emitPeers();if(type==='hello')this.send('presence',this.state);
    }else if(type==='leave'){this.peers.delete(sender);this.emitPeers();}
    else if(type==='chat'&&typeof payload?.text==='string')this.onChat({name:String(payload.name||'Explorer').slice(0,24),text:payload.text.slice(0,300)});
    else if(type==='travel'&&payload&&Number.isFinite(payload.lat)&&Math.abs(payload.lat)<=85&&Number.isFinite(payload.lon)&&Math.abs(payload.lon)<=180)this.onTravel({...payload,id:String(payload.id).slice(0,100),name:String(payload.name).slice(0,100),region:String(payload.region||'').slice(0,100),radius:900});
  }
  emitPeers(){this.onPeers([...this.peers.values()]);}
  send(type,payload){const message={messageId:crypto.randomUUID(),sender:this.id,type,payload};this.local?.postMessage(message);if(this.remoteReady)this.channel?.send({type:'broadcast',event:'world',payload:message});}
  update(state){Object.assign(this.state,state);if(this.room)this.send('move',this.state);}
  chat(text){const msg={name:this.state.name,text:text.slice(0,300)};this.send('chat',msg);this.onChat({...msg,name:'You'});}
  async disconnect(){if(this.room)this.send('leave',{});this.room=null;clearInterval(this.interval);this.local?.close();this.local=null;this.remoteReady=false;if(this.client)await this.client.removeAllChannels();this.client=null;this.channel=null;this.peers.clear();this.seen.clear();this.emitPeers();}
}
