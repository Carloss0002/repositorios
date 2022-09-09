import {useState, useCallback, useEffect} from 'react'
import { Link } from 'react-router-dom'

import {Container, Form, SubmitButton, List, DeleteButton} from './styles'
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import api from '../../services/api'

function Home(){
    
    const [newRepo, setNewRepo] = useState('')
    const [repositorio, setRepositorio] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)
    
    
    useEffect(()=>{
       const repoStorage = JSON.parse(localStorage.getItem('repos'))
       if(repoStorage){
           setRepositorio(repoStorage)
       }
       console.log(repoStorage)
    },[])
    
    useEffect(()=>{
            localStorage.setItem('repos', JSON.stringify(repositorio))
    }, [repositorio])
    



   function handleInput(e){
      setNewRepo(e.target.value)
      setAlert(null)
   }
     
   const handleSubmit = useCallback((e)=>{
    e.preventDefault()
   
   async function submit(){
     setLoading(true)
     setAlert(null)
      try{

        if(newRepo == ''){
            throw new Error('valor não indicado')
        }
          const response = await api.get(`repos/${newRepo}`)
          
          const hasRepo = repositorio.find(repo => repo.name === newRepo)
           
          if(hasRepo){
            throw new Error('repositorio duplicado')
          }
          const data = {
              name: response.data.full_name
          }
   
          console.log(data)
      
          setRepositorio([...repositorio, data])
        }
        catch(error){
            setAlert(true)
            console.log(error)
        }
        finally{
            setLoading(false)
            setNewRepo('')
      }
   }

   submit()

   }, [newRepo, repositorio]) 

    const deleteItem = useCallback((repo)=>{
        const find = repositorio.filter(nameRepo => nameRepo.name !== repo)

        setRepositorio(find)
    }, [repositorio])
    return(
        <Container>
            <h1>
               <FaGithub size={25}/>
                Meus Repositorios
            </h1>
            <Form onSubmit={handleSubmit} error={alert}>
                <input 
                    type="text" 
                    placeholder="Adicionar Repositorios"
                    value={newRepo}
                    onChange={handleInput}
                />
                <SubmitButton loading={loading ? 1 : 0}>
                    {
                    loading ?
                    (
                       <FaSpinner color="#fff" size={14}/>
                       )
                       :
                       (
                     
                        <FaPlus color="#fff" size={14}/>
                    )
                    }
                </SubmitButton>
            </Form>

            <List>
                {repositorio.map(repo=>(
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={()=>deleteItem(repo.name)}>
                                <FaTrash/>
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20}/>
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    )
}

export default Home