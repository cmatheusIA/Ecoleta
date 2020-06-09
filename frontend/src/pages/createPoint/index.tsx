/* eslint-disable react-hooks/rules-of-hooks */
import React,{useEffect, useState, ChangeEvent, FormEvent} from 'react';
import {Map, TileLayer, Marker} from 'react-leaflet'
import {FiArrowLeft} from 'react-icons/fi'
import {Link, useHistory} from 'react-router-dom';
import './style.css'
import logo from '../../assets/logo.svg';
import axios from 'axios';
import api from '../../service/api'
import { LeafletMouseEvent } from 'leaflet';



//********Interfaces ********/
interface Item {
  id: number;
  titulo: string;
  imagem_url: string;
}

interface IBGEUfresponse{
  sigla: string;
}

interface IBGECityresponse{
  nome: string;
}



/**************************** */

const createPoint = ()=>{
  
  
  const [itens, setItens] = useState<Item[]>([])
  
  const [ufs,setUFs] = useState<string[]>([])
  
  const [Inicialposition, setInicialPosition] = useState<[number,number]>([0,0])

  const [formData,setFormData] = useState({
    name:'',
    email:'',
    whatsapp:''
  })
  
  const [selectedUF, setSelectedUF] = useState('0')
  
  const [selectedCity, setSelectedCity] = useState('0')
  
  const [cities, setCities] = useState<string[]>([])
  
  const [position, setPosition] = useState<[number,number]>([0,0])
  
  const [selectedItens, setSelectedItens] = useState<number[]>([])
  
  const history = useHistory()

  // eslint-disable-next-line react-hooks/rules-of-hooks

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position=>{
      const{latitude, longitude} = position.coords
      setInicialPosition([latitude,longitude])
    })
  },[])

  useEffect(()=>{
    api.get('itens').then(response =>{
      setItens(response.data)
    })
  },[]);

  useEffect(()=>{
    axios.get<IBGEUfresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
              .then(response=>{
                  const ufinicials = response.data.map(uf=> uf.sigla)
                  setUFs(ufinicials)
              })
  },[])

  useEffect(()=>{
    if(selectedUF==='0'){
      return;
    }
    axios.get<IBGECityresponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
    .then(response=>{
        const cityNames = response.data.map(city=> city.nome)
        setCities(cityNames)
    })

  },[selectedUF])

  function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
    const uf = event.target.value
    setSelectedUF(uf)
  }
  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
    const city = event.target.value
    setSelectedCity(city)
  }

  function handleMapClick(event:LeafletMouseEvent){
    
    setPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  function handleInputchange(event:ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target
    setFormData({...formData,[name]:value})
  }

  function handleSelectedItem(id:number){

    const alreadySelected = selectedItens.findIndex(item=>item===id)

    if(alreadySelected >=0){
      const filteredItens = selectedItens.filter(item=> item !== id);
      setSelectedItens(filteredItens)
    }else{
      setSelectedItens([...selectedItens,id])
    }


    
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    
    const {name, email, whatsapp} = formData
    const uf = selectedUF;
    const city = selectedCity
    const [latitude,longitude] = position
    const itens = selectedItens

    const data = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      itens
    }
   await api.post('points',data)

   alert('Ponto Criado com sucesso')

   history.push('/')

  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="logo ecologic"/>

        <Link to='/'>
          <FiArrowLeft/>
          Voltar para home 
        </Link>
      
      </header>

      <form onSubmit={handleSubmit}> 
        <h1>Cadastro do <br/>ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados </h2>
          </legend>

          <div className="field">
            <label htmlFor="name">nome da entidade </label>
            <input 
              type="text"
              name="name"
              id="name"
              onChange={handleInputchange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email"
                name="email"
                id="email"
                onChange={handleInputchange}
              />
            </div>

            <div className="field">
              <label htmlFor="name">whatsapp </label>
                <input 
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputchange}
                />
            </div>

          </div>
        </fieldset>
        
        

        <fieldset>
          <legend>
            <h2>Endereço </h2>
            <span>Selecione um endereço no mapa</span>
          </legend>

          <Map center = {Inicialposition} zoom={15} onClick={handleMapClick}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={position}
          />

          </Map>



          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select 
                    name="uf"                     
                    id="uf" 
                    value={selectedUF} 
                    onChange={handleSelectUF} >
                  <option value="0">Selecione uma UF</option>
                  {
                    ufs.map(uf=>(
                    <option key={uf} value={uf}> {uf} </option>
                    ))
                  }
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select 
                  name="city" 
                  id="city"
                  value = {selectedCity}
                  onChange={handleSelectCity}
                  >
                  <option value="0">Selecione uma Cidade</option>
                  {
                    cities.map(city=>(
                      <option key={city} value={city}> {city} </option>
                    ))
                  }
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
           {
             itens.map(item=>(
               <li 
                    key = {item.id} 
                    onClick={()=>handleSelectedItem(item.id)}
                    className={selectedItens.includes(item.id) ? 'selected':''}
                    >
                 <img src={item.imagem_url} alt={item.titulo}></img>
                 <span>{item.titulo}</span>
               </li>
             ))
           }
            
          </ul>
        </fieldset>

        <button type = "submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    
    </div>
  );
}

export default createPoint;