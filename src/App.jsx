import { ProductProvider } from "./context/ProductContext/ProductState";
import './App.css'
import Table from './components/Table/Table'

function App() {
  
  return (
    <>
     <ProductProvider>
      <Table />
    </ProductProvider>
    </>
  )
}

export default App
