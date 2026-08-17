import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { Cargando } from '../componentes/Estados';
import { useAuth } from '../contexto/AuthContext';
import { FavoritosPantalla } from '../pantallas/FavoritosPantalla';
import { HeroeDetallePantalla } from '../pantallas/HeroeDetallePantalla';
import { HeroesPantalla } from '../pantallas/HeroesPantalla';
import { InicioPantalla } from '../pantallas/InicioPantalla';
import { LoginPantalla } from '../pantallas/LoginPantalla';
import { MisionesPantalla } from '../pantallas/MisionesPantalla';
import { tema } from '../tema';
import type { RootStackParamList, TabsParamList } from '../tipos';
const Stack=createNativeStackNavigator<RootStackParamList>();const Tabs=createBottomTabNavigator<TabsParamList>();
const navTheme={...DarkTheme,colors:{...DarkTheme.colors,primary:tema.rojo,background:tema.fondo,card:'#0d0d11',text:tema.texto,border:tema.borde}};
const icons:Record<keyof TabsParamList,string>={Inicio:'⌂',Heroes:'◆',Favoritos:'★',Misiones:'◎'};
function TabsNavegacion(){return <Tabs.Navigator screenOptions={({route})=>({headerStyle:{backgroundColor:'#0d0d11'},headerTintColor:tema.texto,headerTitleStyle:{fontSize:12,fontWeight:'800'},tabBarActiveTintColor:tema.rojo,tabBarInactiveTintColor:'#777076',tabBarShowLabel:true,tabBarLabelStyle:{fontSize:9,fontWeight:'800',letterSpacing:.5},tabBarStyle:{height:68,paddingTop:7,paddingBottom:8,backgroundColor:'#0d0d11',borderTopColor:tema.borde},tabBarIcon:({color})=><Text style={{color,fontSize:18}}>{icons[route.name]}</Text>})}>
<Tabs.Screen name="Inicio" component={InicioPantalla} options={{title:'INICIO'}}/><Tabs.Screen name="Heroes" component={HeroesPantalla} options={{title:'HÉROES'}}/><Tabs.Screen name="Favoritos" component={FavoritosPantalla} options={{title:'FAVORITOS'}}/><Tabs.Screen name="Misiones" component={MisionesPantalla} options={{title:'MISIONES'}}/></Tabs.Navigator>}
export function Navegacion(){const{usuario,cargandoSesion}=useAuth();if(cargandoSesion)return <Cargando texto="Iniciando..."/>;return <NavigationContainer theme={navTheme}>{!usuario?<LoginPantalla/>:<Stack.Navigator screenOptions={{headerStyle:{backgroundColor:'#0d0d11'},headerTintColor:tema.texto,headerTitleStyle:{fontSize:13,fontWeight:'800'}}}><Stack.Screen name="Tabs" component={TabsNavegacion} options={{headerShown:false}}/><Stack.Screen name="HeroeDetalle" component={HeroeDetallePantalla} options={({route})=>({title:route.params.nombre.toUpperCase()})}/></Stack.Navigator>}</NavigationContainer>}
