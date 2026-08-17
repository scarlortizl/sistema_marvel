import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes } from '../api/servicios';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { TarjetaHeroe } from '../componentes/TarjetaHeroe';
import { useFavoritos } from '../contexto/FavoritosContext';
import { tema } from '../tema';
import type { RootStackParamList, Superheroe, TabsParamList } from '../tipos';

type Props = CompositeScreenProps<BottomTabScreenProps<TabsParamList,'Heroes'>,NativeStackScreenProps<RootStackParamList>>;

export function HeroesPantalla({navigation}:Props){
 const {esFavorito,alternarFavorito}=useFavoritos();
 const [heroes,setHeroes]=useState<Superheroe[]>([]); const [cargando,setCargando]=useState(true);
 const [refrescando,setRefrescando]=useState(false); const [error,setError]=useState(''); const [busqueda,setBusqueda]=useState('');
 const cargar=useCallback(async(nombre:string)=>{setError('');try{setHeroes(await servicioHeroes.listar(nombre.trim()||undefined));}catch(e){setError(mensajeDeError(e));}finally{setCargando(false)}},[]);
 useEffect(()=>{const t=setTimeout(()=>cargar(busqueda),350);return()=>clearTimeout(t)},[busqueda,cargar]);
 const refrescar=async()=>{setRefrescando(true);await cargar(busqueda);setRefrescando(false)};
 if(cargando)return <Cargando texto="Cargando superheroes..."/>;
 if(error&&heroes.length===0)return <MensajeError mensaje={error} onReintentar={()=>cargar(busqueda)}/>;
 return <View style={s.root}>
   <View style={s.header}><Text style={s.kicker}>MARVEL DATABASE</Text><Text style={s.title}>SUPERHÉROES</Text><Text style={s.subtitle}>PERFILES ACTIVOS / CONTROL CENTRAL</Text></View>
   <View style={s.searchWrap}><Text style={s.searchIcon}>⌕</Text><TextInput style={s.search} value={busqueda} onChangeText={setBusqueda} placeholder="Buscar por nombre..." placeholderTextColor="#726b6e" autoCapitalize="none"/></View>
   <FlatList data={heroes} keyExtractor={h=>String(h.id)} contentContainerStyle={s.list}
    refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} tintColor={tema.rojo}/>} 
    ListHeaderComponent={<Text style={s.total}>{String(heroes.length).padStart(2,'0')} REGISTROS DISPONIBLES</Text>}
    ListEmptyComponent={<SinDatos mensaje={busqueda?`No se encontraron superheroes con "${busqueda}"`:'No hay superheroes registrados'}/>} 
    renderItem={({item})=><TarjetaHeroe heroe={item} esFavorito={esFavorito(item.id)} onAbrir={()=>navigation.navigate('HeroeDetalle',{id:item.id,nombre:item.nombre})} onFavorito={()=>alternarFavorito(item.id)}/>}/>
 </View>
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:tema.fondo},header:{paddingHorizontal:18,paddingTop:18,paddingBottom:6},kicker:{color:tema.vinoClaro,fontSize:9,fontWeight:'900',letterSpacing:2},title:{color:tema.texto,fontSize:31,fontWeight:'900',letterSpacing:-1.2,marginTop:2},subtitle:{color:'#746d71',fontSize:8,fontWeight:'700',letterSpacing:1.4,marginTop:3},searchWrap:{height:48,margin:16,marginBottom:8,borderWidth:1,borderColor:tema.borde,borderRadius:12,backgroundColor:tema.superficie,flexDirection:'row',alignItems:'center',paddingHorizontal:13},searchIcon:{color:tema.vinoClaro,fontSize:22,marginRight:8},search:{flex:1,color:tema.texto,fontSize:13},list:{paddingHorizontal:16,paddingBottom:30,flexGrow:1},total:{color:'#6f686c',fontSize:8,fontWeight:'800',letterSpacing:1.4,marginBottom:12}});
