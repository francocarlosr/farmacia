import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

function Stock() {
    
    const navigate = useNavigate();

    const token = localStorage.getItem('token')

    const [stock,setStock] = useState({
        stock_cantidad: 0,
        id_libro: 0,
        libro_nombre: "",
        id_stock:0
    })

    const [stocks, setStocks] = useState([]);
    const [stockSeleccionado, setStockSeleccionado] = useState({})
    const [libro, setLibro] = useState([])
    const [visible, setVisible] = useState(false)
  
    useEffect(() => {
      fetch("http://localhost:3000/stock",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((stocks) => { setStocks(stocks[0])});
        
    }, []);

    useEffect(() => {
      !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
    }, []);


    useEffect(() => {
        fetch("http://localhost:3000/libros",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        })
          .then((res) => res.json())
          .then((libro) => setLibro(libro));
          
       }, []);
  
       const clickStock = async (stock) => {
        setStockSeleccionado(stock.id_stock)
         setStock({
          stock_cantidad: stock.stock_cantidad,
          id_libro: stock.id_libro,
          libro_nombre: stock.libro_nombre
        })
         setVisible(true)
    };

    function mensajeError(){
      let mensaje = "Ha ocurrido un error"
      stock.stock_cantidad == '' ? mensaje = mensaje + "\nCantidad vacia" : null
      stock.id_libro == '' ? mensaje = mensaje + "\nSeleccione un libro" : null
      return mensaje 
    }
    
  
    const eliminarStock = async (stockId) => {
      if (window.confirm("¿Desea eliminar ?")) {
        const res = await fetch(`http://localhost:3000/stock/${stockId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}`},
        });
  
        if (res.ok) {
          setStocks(stocks.filter((stock) => stock.id_stock !== stockId));
        } else {
          alert("Fallo al quitar stock");
        }
      }
      limpiarForm()
      setVisible(false)
    };
  
  const agregarStock = async () => {
    const url = 'http://localhost:3000/stock/libros/' + stock.id_libro
      const res = await fetch(url, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            cantidad: +stock.stock_cantidad,
            id_libro: +stock.id_libro
        }),
      });
     
      if (res.ok) {
        const stockNuevo = await res.json();
        fetch("http://localhost:3000/stock",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        })
          .then((res) => res.json())
          .then((stocks) => { setStocks(stocks[0])});
          limpiarForm()
          setVisible(false)
      } else {
        alert(mensajeError())
      }
     
    };
  
    
    function limpiarForm() {
      setStock({
          stock_cantidad: 0,
          id_libro:0
      })
      setVisible(false)
    }

    return (
        <>
            <main className="md:w-3/5  xl:w-4/5 px-5 py-10 bg-gray-200">
                <h2 className="text-3xl font-light text-center">Stock</h2>
                <div className="flex flex-col mt-10 items-center">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                        <div className=" shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                            <div id="formulario" className="bg-white p-3">
                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidad">Cantidad:</label>
                                    <input
                                        onChange={(e)=>{setStock({...stock, stock_cantidad: parseInt(e.target.value)})}}
                                        value={stock.stock_cantidad}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cantidad"
                                        name="cantidad"
                                        type="number"
                                        placeholder="Cantidad de stock de libros"
                                    />
                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="libro">Productos:</label>
                                     <select
                                          onChange={(e) => {
                                            setStock({ ...stock, id_libro: e.target.value, libro_nombre: e.target.options[e.target.selectedIndex].text });
                                          }}
                                          className="p-2 bg-teal-50 border border-teal-900 text-teal-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                          value={stock.id_libro}
                                        >
                                          <option value="0" className="font-black">Seleccionar</option>
                                          {libro.map((item, index) => (
                                            <option key={index} value={item.id_libro} className="font-black, text-teal-700">
                                              {item.nombre}
                                            </option>
                                          ))}
                                        </select>


                                </div>
                                {/* Input */}

                                {/* Botón Agregar */}
                                {visible ? (
                            <input
                              onClick={edicionStock}
                              type="submit"
                              className="bg-gray-600 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                              value="Editar Stock"
                            />
                          ) : (
                            <input
                              onClick={agregarStock}
                              type="submit"
                              className="bg-gray-600 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                              value="Agregar Stock"
                            />
                          )}
                            {visible && (
                            <input
                              type="submit"
                              onClick={cancelarEdicion}
                              className="bg-gray-500 hover:bg-gray-700 text-white w-full mt-5 p-2 uppercase font-bold"
                              value="Cancelar"
                            />
                            )}
                                {/* /Botón  Editar*/}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Stock
