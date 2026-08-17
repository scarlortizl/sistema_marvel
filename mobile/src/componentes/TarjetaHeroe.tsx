import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colorEtiqueta, tema } from '../tema';
import type { Superheroe } from '../tipos';

interface Props { heroe: Superheroe; esFavorito: boolean; onAbrir: () => void; onFavorito: () => void; }

export function TarjetaHeroe({ heroe, esFavorito, onAbrir, onFavorito }: Props) {
  return (
    <TouchableOpacity style={s.card} onPress={onAbrir} activeOpacity={0.86}>
      <View style={s.media}>
        <Image source={{ uri: heroe.imagen_url }} style={s.image} />
        <View style={s.mediaShade} />
        <View style={s.topRow}>
          <Text style={s.code}>HERO // {String(heroe.id).padStart(2,'0')}</Text>
          <Text style={[s.status,{color:colorEtiqueta[heroe.estado]}]}>● {heroe.estado}</Text>
        </View>
        <TouchableOpacity style={s.fav} onPress={onFavorito} hitSlop={10}>
          <Text style={[s.star,esFavorito&&s.starOn]}>{esFavorito?'★':'☆'}</Text>
        </TouchableOpacity>
        <View style={s.identity}>
          <Text style={s.name}>{heroe.nombre}</Text>
          <Text style={s.real}>{heroe.nombre_real}</Text>
        </View>
      </View>
      <View style={s.body}>
        <Text style={s.micro}>PRIMARY ABILITY</Text>
        <Text style={s.power}>{heroe.poder_principal}</Text>
        <View style={s.powerRow}><Text style={s.micro}>POWER LEVEL</Text><Text style={s.score}>{heroe.nivel_poder}/100</Text></View>
        <View style={s.track}><View style={[s.fill,{width:`${Math.max(0,Math.min(100,heroe.nivel_poder))}%`}]} /></View>
        <Text style={s.open}>VER PERFIL  →</Text>
      </View>
    </TouchableOpacity>
  );
}

const s=StyleSheet.create({
  card:{backgroundColor:tema.superficie,borderWidth:1,borderColor:tema.borde,borderRadius:18,overflow:'hidden',marginBottom:18},
  media:{height:285,backgroundColor:'#09090c',position:'relative'},image:{width:'100%',height:'100%'},
  mediaShade:{position:'absolute',inset:0,backgroundColor:'rgba(0,0,0,.18)'},
  topRow:{position:'absolute',top:14,left:14,right:14,flexDirection:'row',justifyContent:'space-between'},
  code:{color:'#c7c1c4',fontSize:9,fontWeight:'800',letterSpacing:1.5},status:{fontSize:9,fontWeight:'900',letterSpacing:1},
  fav:{position:'absolute',right:14,top:42,width:40,height:40,borderRadius:20,backgroundColor:'rgba(5,5,7,.72)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#49333b'},
  star:{fontSize:22,color:'#a79fa3'},starOn:{color:tema.rojo},
  identity:{position:'absolute',left:16,right:16,bottom:15},name:{color:'#fff',fontSize:28,fontWeight:'900',textTransform:'uppercase',letterSpacing:-.8},real:{color:'#c2bbbe',fontSize:12,marginTop:2},
  body:{padding:16},micro:{color:'#847c80',fontSize:8,fontWeight:'800',letterSpacing:1.6},power:{color:tema.texto,fontSize:14,fontWeight:'700',marginTop:4,marginBottom:15},
  powerRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},score:{color:tema.vinoClaro,fontSize:11,fontWeight:'900'},
  track:{height:5,backgroundColor:'#282127',marginTop:7,overflow:'hidden'},fill:{height:'100%',backgroundColor:tema.rojo},
  open:{color:'#d7d0d3',fontSize:10,fontWeight:'900',letterSpacing:1.2,marginTop:16},
});
