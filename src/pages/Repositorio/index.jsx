import { useEffect, useState } from "react"
import { useParams} from "react-router-dom"
import api from "../../services/api"

import {Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList} from './style'
import {FaArrowLeft} from 'react-icons/fa'

function Repositorio(){
    let repo = useParams()
    
    const[repositorio, setRepositorio]=useState({})
    const[issues, setIssues] = useState([])
    const[loading, setLoading] = useState(true)
    const[page, setPage] = useState(1)
    // minha solução const[state, setState] = useState('open')
    const[filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: false},
        {state: 'open', label: 'Abertas', active: true},
        {state: 'closed', label: 'Fechadas', active: false}
    ])
    const [filterIndex, setFilterIndex] = useState(0)

    useEffect(()=>{
        async function load(){
             const nomeRepo = repo.repositorio
             
            const[repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`,{
                    params:{
                        state: filters.find(state => state.active).state,
                        per_page: 5
                    }
                })
            ])
            
            setRepositorio(repositorioData.data)
            console.log(repositorioData.data)
            setIssues(issuesData.data)
            setLoading(false)
        }
          load()
    },[repo])
    
    useEffect(()=>{
        async function loadIssue(){
            const repoName = repo.repositorio

            const response = await api.get(`/repos/${repoName}/issues`,{
                params:{
                    //minha solução state,
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5, 
                }
            })

            setIssues(response.data)
        }

        loadIssue()
    }, [repo, page, filters, filterIndex])
    
    // function mudarState(valor){
    // minha solução
    //     setState(valor)
    // }

    function handleFilter(index){
        setFilterIndex(index)
    }

    function passPage(value){
        if(value === 'next'){
            setPage(page+1)
        } else if(value === 'back' && page > 1){
            setPage(page-1)
        }
    }

    if(loading){
        return(
            <Loading>
                <h1>
                    Carregando 
                </h1>
            </Loading>
        )
    }
    return(
        <Container>
            <BackButton to="/">
                <FaArrowLeft color="#000" size={30}/>
            </BackButton>
            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.name}/>
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>
            <IssuesList>

                <FilterList active={filterIndex}>
                    {/* minha solução
                     <button type="button" onClick={()=>mudarState('open')}>Abertos</button>
                    <button type="button" onClick={()=>mudarState('closed')}>Fechados</button>
                    <button type="button" onClick={()=>mudarState('all')}>Todas</button> */}

                    {filters.map((filter, index)=>(
                        <button
                            type="button"
                            key={filter.label}
                            onClick={()=>handleFilter(index)}
                        >
                          {filter.label}
                        </button>
                    ))}
                </FilterList>

                {issues.map(item=>{
                    return(
                        <li key={item.id}>
                            <img src={item.user.avatar_url} alt={item.user.login}/>
                             <div>
                                <strong>
                                    <a href={item.html_url}>{item.title}</a>
                                    {item.labels.map(label=>(
                                        <span key={label.id}>{label.name}</span>
                                    ))}
                                </strong>
                                <p>{item.user.login}</p>
                             </div>
                        </li>
                    )
                })}
            </IssuesList>

            <PageActions>
                <button 
                    type="button"
                    onClick={()=>passPage('back')}
                    disabled={page<2}
                >
                    Voltar
                </button>
                {page}
                <button 
                    type="button"
                    onClick={()=>passPage('next')}
                >
                    Proxima
                </button>
            </PageActions>
        </Container>
    )
}

export default Repositorio