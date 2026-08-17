import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { mensajeDeError } from '../api/cliente';
import { servicioMisiones } from '../api/servicios';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { colorEtiqueta, tema } from '../tema';
import type { Mision } from '../tipos';

const riesgo=(n:string)=>n==='ALTO'?100:n==='MEDIO'?67:34;
export function MisionesPantalla(){
 const [misiones,setMisiones]=useState<Mision[]>([]);const[cargando,setCargando]=useState(true);const[refrescando,setRefrescando]=useState(false);const[error,setError]=useState('');
 const cargar=async()=>{setError('');try{setMisiones(await servicioMisiones.listar())}catch(e){setError(mensajeDeError(e))}finally{setCargando(false)}};
 useEffect(()=>{cargar()},[]);const refrescar=async()=>{setRefrescando(true);await cargar();setRefrescando(false)};
 if(cargando)return <Cargando texto="Cargando misiones..."/>;if(error&&misiones.length===0)return <MensajeError mensaje={error} onReintentar={cargar}/>;
 return <FlatList style={s.root} data={misiones} keyExtractor={m=>String(m.id)} contentContainerStyle={s.list}
  refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} tintColor={tema.rojo}/>} 
  ListHeaderComponent={<View style={s.header}><Text style={s.kicker}>TACTICAL OPERATIONS</Text><Text style={s.title}>MISSION / CONTROL</Text><Text style={s.total}>{String(misiones.length).padStart(2,'0')} OPERACIONES REGISTRADAS</Text></View>}
  ListEmptyComponent={<SinDatos mensaje="No hay misiones registradas"/>}
  renderItem={({item,index})=>{const r=riesgo(item.nivel_peligro);return <View style={s.card}>
   <View style={s.media}>{item.superheroe?<Image source={{uri:item.superheroe.imagen_url}} style={s.image}/>:<View style={s.placeholder}/>}<View style={s.overlay}/><Text style={s.id}>MSP // {String(index+1).padStart(2,'0')}</Text><Text style={[s.state,{color:colorEtiqueta[item.estado]}]}>● {item.estado}</Text></View>
   <View style={s.body}><Text style={s.micro}>TACTICAL OPERATION</Text><Text style={s.name}>{item.titulo}</Text><Text style={s.hero}>{item.superheroe?.nombre??'SIN SUPERHÉROE ASIGNADO'}</Text><Text style={s.desc}>{item.descripcion}</Text>
   <View style={s.specs}><View><Text style={s.specLabel}>LOC</Text><Text style={s.specValue}>{item.ubicacion}</Text></View><View><Text style={s.specLabel}>DATE</Text><Text style={s.specValue}>{new Date(item.fecha).toLocaleDateString('es-EC')}</Text></View></View>
   <View style={s.riskTop}><Text style={s.specLabel}>PRM_LVL / {item.nivel_peligro}</Text><Text style={[s.riskValue,{color:colorEtiqueta[item.nivel_peligro]}]}>{r}%</Text></View><View style={s.track}><View style={[s.fill,{width:`${r}%`}]} /></View></View>
  </View>}}/>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:tema.fondo},list:{padding:16,paddingBottom:30,flexGrow:1},header:{marginBottom:16},kicker:{color:tema.vinoClaro,fontSize:9,fontWeight:'900',letterSpacing:2},title:{color:tema.texto,fontSize:30,fontWeight:'900',letterSpacing:-1,marginTop:3},total:{color:'#6f686c',fontSize:8,fontWeight:'800',letterSpacing:1.4,marginTop:7},card:{backgroundColor:tema.superficie,borderWidth:1,borderColor:tema.borde,borderRadius:17,overflow:'hidden',marginBottom:17},media:{height:155,position:'relative',backgroundColor:'#0b0b0e'},image:{width:'100%',height:'100%'},placeholder:{flex:1,backgroundColor:'#171218'},overlay:{position:'absolute',inset:0,backgroundColor:'rgba(0,0,0,.32)'},id:{position:'absolute',top:12,left:13,color:'#d5cfd2',fontSize:8,fontWeight:'900',letterSpacing:1.4},state:{position:'absolute',top:12,right:13,fontSize:8,fontWeight:'900',letterSpacing:.7},body:{padding:15},micro:{color:tema.vinoClaro,fontSize:8,fontWeight:'900',letterSpacing:1.5},name:{color:tema.texto,fontSize:21,fontWeight:'900',marginTop:3},hero:{color:'#c2b9bd',fontSize:10,fontWeight:'800',letterSpacing:1,marginTop:2},desc:{color:tema.textoTenue,fontSize:12,lineHeight:18,marginTop:12},specs:{flexDirection:'row',justifyContent:'space-between',borderTopWidth:1,borderTopColor:tema.bordeSuave,marginTop:14,paddingTop:12},specLabel:{color:'#746d71',fontSize:8,fontWeight:'900',letterSpacing:1.3},specValue:{color:'#d9d3d6',fontSize:11,fontWeight:'700',marginTop:3,maxWidth:150},riskTop:{flexDirection:'row',justifyContent:'space-between',marginTop:15},riskValue:{fontSize:10,fontWeight:'900'},track:{height:5,backgroundColor:'#2a2227',marginTop:6},fill:{height:'100%',backgroundColor:tema.rojo}});
