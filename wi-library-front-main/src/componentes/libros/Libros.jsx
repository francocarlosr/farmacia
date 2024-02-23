import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



function Libros() {

    const navigate = useNavigate();
    
    const token = localStorage.getItem('token')

    const [libro, setLibro] = useState({
        nombre: "",
        año: 0,
        tipo: "",
        isbn: "",
        precio:0,
        id_autor: 0,
        id_editorial: 0,
        id_proveedor: 0,
        id_categoria: 0
        
    })
  const [libros, setLibros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [autores, setAutores] = useState([])
  const [editorial, setEditorial] = useState([])
  const [proveedor, setProveedor] = useState([])
  const [libroSeleccionada, setLibroSeleccionada] = useState({})
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    fetch("http://localhost:3000/libros",{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}` 
      }
    })
      .then((res) => res.json())
      .then((libros) => setLibros(libros));
      
  }, []);

  useEffect(() => {
    !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
  }, []);


  function mensajeError(){
    let mensaje = "Ha ocurrido un error"
    libro.nombre == '' ? mensaje = mensaje + "\n Nombre vacio" : null
    libro.precio == '' ? mensaje = mensaje + "\n Precio vacio" : null

    return mensaje 
  }

  
  
  const agregarLibros = async () => {
    const res = await fetch("http://localhost:3000/libros", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
          nombre: libro.nombre,
          año: 0,
          tipo: " ",
          isbn: " ",
          precio:+libro.precio,
          id_autor: 1,
          id_editorial: 1,
          id_proveedor: 1,
          id_categoria: 1
       
      }),
    });

    if (res.ok) {
      const LibroNuevo = await res.json();
      setLibros([...libros, LibroNuevo]);
      setVisible(false)
      limpiarForm()
    } else {
      alert(mensajeError())
    }

    
  };

  const edicionLibro = async () => {
    if (window.confirm("¿Desea Editar ?")) {
      const res = await fetch(`http://localhost:3000/libros/${libroSeleccionada}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: libro.nombre,
          año: 0,
          tipo: " ",
          isbn: " ",
          precio:+libro.precio,
          id_autor: 1,
          id_editorial: 1,
          id_proveedor: 1,
          id_categoria: 1
      }),
    });

      if (res.ok) {
        setLibros(
          libros.map((item) => item.id_libro === libroSeleccionada ? libro : item)
        );
        limpiarForm();
        setVisible(false);
      } else {
        alert("Error al editar el libro.");
      }
    }
  };
  

  const eliminarLibro = async (libroId) => {
    if (window.confirm("¿Desea eliminar ?")) {
      const res = await fetch(`http://localhost:3000/libros/${libroId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`},
      });

      if (res.ok) {
        setLibros(libros.filter((libro) => libro.id_libro !== libroId));
      } else {
        alert("Fallo al quitar libro");
      }
    }
    limpiarForm()
    setVisible(false)
  };

  const cancelarEdicion = () => {
    limpiarForm();
    setVisible(false);
  };

  function limpiarForm() {
    setLibro({
      nombre: "",
      año: 0,
      tipo: "",
      isbn: "",
      precio:0,
      id_autor: 0,
      id_editorial: 0,
      id_proveedor: 0,
      id_categoria: 0
    })
    setVisible(false)
  }

  return (
    <>
      <main className="md:w-3/5  xl:w-4/5 px-5 py-10 bg-gray-200">
          <h2 className="text-3xl font-light text-center">Nuevo Producto</h2>
            <div className="flex flex-col mt-10 items-center">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                    <div className=" shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                      
                        <div id="formulario" className="bg-white p-3">
                          {/* Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre:</label>
                                <input 
                                    value={libro.nombre}
                                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    placeholder="Ingresar nombre del libro"
                                    onChange={(e)=>{setLibro({...libro, nombre: e.target.value})}}
                                />
                            </div>
                            {/* Input */}
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio:</label>
                                <input 
                                    value={libro.precio}
                                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="precio"
                                    name="precio"
                                    type="number"
                                    placeholder="Ingresar precio del libro"
                                    onChange={(e)=>{setLibro({...libro, precio: e.target.value})}}
                                />
                            </div>

                            {/* Botón */}
                          
                          {/* /Botón Cancelar */}
                          {/* Botón Agregar o Editar */}
                          {visible ? (
                            <input
                              onClick={edicionLibro}
                              type="submit"
                              className="bg-teal-600 hover:bg-teal-900 w-full mt-5 p-2 text-white uppercase font-bold"
                              value="Editar Libro"
                            />
                          ) : (
                            <input
                              onClick={agregarLibros}
                              type="submit"
                              className="bg-gray-600 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                              value="Agregar"
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
          <h2 className="text-3xl font-light text-center mt-20">Listado</h2>
          <div className="flex flex-col mt-10">
              <div className="py-2 overflow-x-auto">
                <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                   <table className="min-w-full">
                        <thead className="bg-gray-100 " >
                            <tr>
                                <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                        Nombre
                                </th>

                                <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                        Precio

                                </th>
                                <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                        Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody id="listado-Libros" className="bg-white">
                  {
                    libros.map((l)=>(
                                        <tr key={l.id_libro}>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {l.nombre}
                                            </th>


                                            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {l.precio}
                                            </th>

                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                <span className="cursor-pointer" onClick={()=>{eliminarLibro(l.id_libro)}}>🗑️</span>
                                            </th>
                                        </tr>
                                        
                                     ))}
                                    
                        </tbody>
                    </table>
                  </div>``
                </div>
              </div>

        </main>
    </>
  )
}

export default Libros
