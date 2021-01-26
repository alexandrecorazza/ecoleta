import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import './styles.css'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom' /*o history serve para navegarmos de um componente ao outro sem ter nenhum
botão, usando apenas linha de código mesmo.*/
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet' /*Não usamos o map do Google pq tem que fazer cadastro, colocar cartão de
crédito(mesmo sendo gratuito), etc. Pra evitar isso usamos o leaflet que tbm é um mapa e open source*/
import { LeafletMouseEvent } from 'leaflet' //olhar a documentação e os exemplos. https://react-leaflet.js.org/docs/en/examples
import api from '../../services/api'
import axios from 'axios'

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {

    // para array ou objeto: devemos colocar sempre o tipo da variável manualmente

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCitie] = useState<string[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const [selectedUf, setSelectedUf] = useState('0');  //não armazena array ou objeto, apenas o estado atual do uf selecionado. Portanto, não precisa criar uma interface.
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

    const history = useHistory(); /* usamos o history para enviar o usuário para a página home dps dele submeter os dados e
    cadastrar um ponto de coleta */

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            //console.log(position.coords)
            setInitialPosition([latitude, longitude]);
        })
        //é uma API do próprio navegador
    }, [])

    useEffect(() => {
        api.get('items').then(response => {
            //console.log(response.data)
            setItems(response.data);
        });
    }, []) /* primeiro parâmetro: Qual função eu quero executar. Segundo parâmetro é quando quero que essa função execute. 
    Quando o segundo parâmetro estiver vazio, ele executa uma só vez, que é o que queremos! */

    useEffect(() =>{
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            //originalemnte ele não reconhece o uf dentro do map, então para isso foi necessário criar uma interface(IBGEUFResponse)
            //setUfs(response.data) response.data só funcionaria nesse caso se a chamada não retornasse IBGEUFResponse[]
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        //carregar as cidades sempre que a uf mudar
        if (selectedUf === '0'){
            return;
        }
        
        axios
        .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        /*<IBGECityResponse[]> sgnifica que a nossa chamada irá retornar um array com o formato
        IBGCECityResponse(interface declarada na linha 22), que é um objeto
        contendo o 'nome' dentro, que é uma string*/
        .then(response => {
            const cityNames = response.data.map(city => city.nome);
            //originalemnte ele não reconhece o uf dentro do map, então para isso foi necessário criar uma interface(IBGEUFResponse)

            setCitie(cityNames);
        });

    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){    /* originalmente o typescript não reconhece o event como
        sendo mesmo um evento para isso, foi necessário importar esse ChangeEvent do React. O <HTMLSelectElement> serve para
        pegarmos a ação do usuário no DOM, que seria o .target.value */
        
        /* usar o guia https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
        para entender mais sobre os eventos e como utilizar o react no typescript */
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
        console.log(event.latlng)   //evento de pegar a latitude e longitude(coloca a agulha no mapa onde clicarmos)
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        //console.log(event)
        //console.log(event.target.name, event.target.value)
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value}); //colocamos o colchete no name pra usar a variável como nome da propriedade
        //name é o nome do meu input
    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);
        //o findIndex retorna um número acima de -1 se o que eu estiver buscando está dentro do array, senão ele retorna -1

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }

        //fizemos essa condição para podermos selecionar o item e tirar a seleção se não quisermos mais aquele item
    }

    async function handleSubmit(event: FormEvent) {   /* importamos o FormEvent para usar o event.preventDefault() para nossa página não
        recarregar quando submetermos o form */
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition  //desestrutura dessa forma pq a selectedPosition é um array
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        //console.log(data);
        await api.post('points', data);
        alert('Ponto de coleta criado!');

        history.push('/'); //levaremos o usuário para a página inicial automaticamente assim que o ponto de coleta for cadastrado
    }

    return (
        <div id="page-create-point">
            {/*console.log('renderizou')*/}
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa!</span>
                    </legend>

                    <Map center={initialPosition} zoom={16} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />  {/* Esse TileLayer com as props é o layout do mapa */}

                        <Marker position={selectedPosition}>   {/* É o aquele alfinete que marca exatamente onde estamos no mapa */}

                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >  
                            {/* sempre que quisermos chamar uma função do HTML que e se essa função for passar um parâmetro, que
                            é o caso da nossa onClick, precisamos criar uma nova função como arrow function. Caso nosso
                            OnClick não invoque uma função com parâmetro, não é necessário o uso do arrow function.
                            EX com arrow function: onClick={() => handleSelectItem(item.id)}.
                            Ex sem arrow function: onClick={handleSelectItem}
                            */}
                            
                            {/* sempre que percorremos um array no React ou fazemos alguma iteração,
                            o primeiro elemento dentro desse retorno precisa ter uma propriedade obrigatória
                            chamada KEY, que serve para o React conseguir encontrar e atualizar esse elemento
                            de uma forma mais rápida. O valor da key precisa ser o valor único entre cada um desses items,
                            que no caso, é o nosso ID. Sem essa key, podemos ver pelo console que um erro nos é retornado */}
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;