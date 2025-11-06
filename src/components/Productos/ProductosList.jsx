import React, { useState, useEffect } from "react";
import { productoService, productoImagenService } from "../../services/api";
import "./ProductosList.css";

// ✅ COMPONENTE SEPARADO PARA MANEJO DE IMÁGENES CON FALLBACK
const ImagenConFallback = ({
  src,
  alt,
  className,
  fallbackText = "Imagen no disponible",
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`image-error ${className || ""}`}>
        <span>📷</span>
        <br />
        <small>{fallbackText}</small>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        console.log("❌ Error cargando imagen:", src);
        setHasError(true);
      }}
      loading="lazy"
    />
  );
};

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    imagenesLocales: [],
  });
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState("");

  const [newImageUrl, setNewImageUrl] = useState("");
  const [savingImages, setSavingImages] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await productoService.getAll();
      console.log("📦 Productos cargados:", response.data);

      const productosData = response.data;

      if (Array.isArray(productosData)) {
        setProductos(productosData);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarImagenesProducto = async (productoId) => {
    try {
      const response = await productoImagenService.getByProducto(productoId);
      return response.data;
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      return [];
    }
  };

  const actualizarProducto = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 Enviando actualización:", editForm);

      const datosActualizados = {
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
        precio: editForm.precio,
        stock: editForm.stock,
        idCategoria: editForm.idCategoria,
        idProveedor: editForm.idProveedor,
        idMarca: editForm.idMarca,
      };

      const response = await productoService.update(
        editingProduct.idProducto,
        datosActualizados
      );

      if (response.success) {
        await guardarImagenesBackend();
        setEditingProduct(null);
        setEditForm({ imagenesLocales: [] });
        cargarProductos();
        alert("✅ Producto actualizado correctamente");
      } else {
        alert("❌ Error en la actualización: " + (response.message || ""));
      }
    } catch (error) {
      console.error("❌ Error completo:", error);
      alert(
        "❌ Error al actualizar el producto: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const guardarImagenesBackend = async () => {
    if (!editForm.imagenesLocales || editForm.imagenesLocales.length === 0) {
      return;
    }

    setSavingImages(true);
    try {
      const imagenesParaGuardar = editForm.imagenesLocales;

      // Eliminar imágenes existentes
      try {
        const imagenesExistentes = await cargarImagenesProducto(
          editingProduct.idProducto
        );
        for (const imagen of imagenesExistentes) {
          await productoImagenService.deleteImagen(imagen.idImagen);
        }
      } catch (error) {
        console.log(
          "ℹ️ No había imágenes existentes o error al eliminarlas:",
          error
        );
      }

      // Guardar nuevas imágenes
      for (const imagen of imagenesParaGuardar) {
        try {
          const imagenData = {
            urlImagen: imagen.urlImagen,
            principal: imagen.principal || "N",
          };
          await productoImagenService.addImagen(
            editingProduct.idProducto,
            imagenData
          );
        } catch (error) {
          console.error("❌ Error guardando imagen:", error);
        }
      }
    } catch (error) {
      console.error("❌ Error en guardarImagenesBackend:", error);
      throw error;
    } finally {
      setSavingImages(false);
    }
  };

  const agregarImagen = () => {
    if (!newImageUrl.trim()) {
      alert("❌ Por favor ingresa una URL válida");
      return;
    }

    try {
      new URL(newImageUrl);
    } catch (error) {
      alert(
        "❌ Por favor ingresa una URL válida (debe empezar con http:// o https://): " +
          error.message
      );
      return;
    }

    const urlExistente = editForm.imagenesLocales?.some(
      (img) => img.urlImagen === newImageUrl
    );

    if (urlExistente) {
      alert("❌ Esta URL de imagen ya está agregada");
      return;
    }

    const esPrimeraImagen =
      !editForm.imagenesLocales || editForm.imagenesLocales.length === 0;

    const nuevaImagen = {
      urlImagen: newImageUrl,
      principal: esPrimeraImagen ? "S" : "N",
      idImagen: `temp-${Date.now()}`,
    };

    const nuevasImagenes = [...(editForm.imagenesLocales || []), nuevaImagen];

    setEditForm({
      ...editForm,
      imagenesLocales: nuevasImagenes,
    });
    setNewImageUrl("");
  };

  const eliminarImagen = async (index, imagenId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      return;
    }

    if (imagenId && typeof imagenId === "number" && imagenId > 1000) {
      try {
        await productoImagenService.deleteImagen(imagenId);
      } catch (error) {
        console.error("❌ Error eliminando imagen del backend:", error);
      }
    }

    const nuevasImagenes = [...(editForm.imagenesLocales || [])];
    const imagenEliminada = nuevasImagenes[index];

    nuevasImagenes.splice(index, 1);

    if (imagenEliminada.principal === "S" && nuevasImagenes.length > 0) {
      const otraPrincipal = nuevasImagenes.find((img) => img.principal === "S");
      if (!otraPrincipal) {
        nuevasImagenes[0].principal = "S";
      }
    }

    setEditForm({
      ...editForm,
      imagenesLocales: nuevasImagenes,
    });
  };

  const establecerImagenPrincipal = async (index) => {
    const imagen = editForm.imagenesLocales[index];

    if (
      imagen.idImagen &&
      typeof imagen.idImagen === "number" &&
      imagen.idImagen > 1000
    ) {
      try {
        await productoImagenService.setPrincipal(imagen.idImagen);
      } catch (error) {
        console.error(
          "❌ Error estableciendo imagen principal en backend:",
          error
        );
        alert("❌ Error al establecer imagen principal en el servidor");
        return;
      }
    }

    const nuevasImagenes = [...editForm.imagenesLocales];

    nuevasImagenes.forEach((img) => {
      if (img.principal === "S") {
        img.principal = "N";
      }
    });

    nuevasImagenes[index].principal = "S";

    setEditForm({
      ...editForm,
      imagenesLocales: nuevasImagenes,
    });
  };

  // ✅ FUNCIÓN: Obtener imagen principal
  const obtenerImagenPrincipal = (producto) => {
    if (!producto.imagenes || producto.imagenes.length === 0) {
      return ""; // URL de imagen por defecto si lo deseas
    }
    const imagenPrincipal = producto.imagenes.find(
      (img) => img.principal === "S"
    );
    return imagenPrincipal
      ? imagenPrincipal.urlImagen
      : producto.imagenes[0].urlImagen;
  };

  const actualizarStock = async (productoId, stock) => {
    try {
      const stockValue = parseInt(stock);
      if (isNaN(stockValue) || stockValue < 0) {
        alert("❌ El stock debe ser un número válido y no negativo");
        return;
      }

      const response = await productoService.actualizarStock(
        productoId,
        stockValue
      );

      if (response.success) {
        cargarProductos();
        setShowStockModal(false);
        setNewStock("");
        alert("✅ Stock actualizado correctamente");
      } else {
        alert("❌ Error al actualizar stock");
      }
    } catch (error) {
      console.error("❌ Error actualizando stock:", error);
      alert(
        "❌ Error al actualizar el stock: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const abrirModalEdicion = async (producto) => {
    const imagenesBackend = await cargarImagenesProducto(producto.idProducto);

    setEditingProduct(producto);
    setEditForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      stock: producto.stock || 0,
      idCategoria:
        producto.idCategoria || producto.categoria?.idCategoria || "",
      idProveedor:
        producto.idProveedor || producto.proveedor?.idProveedor || "",
      idMarca: producto.idMarca || producto.marca?.idMarca || "",
      imagenesLocales: imagenesBackend.map((img) => ({
        idImagen: img.idImagen,
        urlImagen: img.urlImagen,
        principal: img.principal,
      })),
    });
    setNewImageUrl("");
  };

  const abrirModalStock = (producto) => {
    setSelectedProduct(producto);
    setNewStock(producto.stock?.toString() || "0");
    setShowStockModal(true);
  };

  if (loading) return <div className="loading">Cargando productos...</div>;

  return (
    <div className="productos-container">
      <h2 className="productos-titulo">⚙️ Gestión de Productos</h2>

      {/* Agregar aquí el botón de crear producto */}
      <button
        className="btn-crear-producto"
        onClick={() => console.log("Crear producto")}
      >
        ➕ Crear Nuevo Producto
      </button>

      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.idProducto} className="producto-card">
            <div className="producto-imagen">
              <ImagenConFallback
                src={obtenerImagenPrincipal(producto)}
                alt={producto.nombre}
                className="card-imagen"
                fallbackText="Sin imagen"
              />
            </div>

            <div className="producto-header">
              <h3>{producto.nombre}</h3>
              <span
                className={`stock-badge ${
                  producto.stock < 10 ? "low-stock" : ""
                }`}
              >
                Stock: {producto.stock}
              </span>
            </div>

            <p className="producto-descripcion">{producto.descripcion}</p>
            <p className="producto-precio">S/. {producto.precio}</p>

            <div className="producto-info">
              <p>
                <strong>Categoría:</strong> {producto.categoria?.nombre}
              </p>
              <p>
                <strong>Marca:</strong> {producto.marca?.nombre}
              </p>
              <p>
                <strong>Proveedor:</strong> {producto.proveedor?.nombre}
              </p>
            </div>

            <div className="producto-actions">
              <button
                onClick={() => abrirModalEdicion(producto)}
                className="btn-editar"
              >
                ✏️ Editar
              </button>

              <button
                onClick={() => abrirModalStock(producto)}
                className="btn-stock"
              >
                📊 Stock
              </button>
            </div>
          </div>
        ))}
      </div>

      {showStockModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Actualizar Stock</h3>
            <p>
              <strong>Producto:</strong> {selectedProduct.nombre}
            </p>
            <p>
              <strong>Stock actual:</strong> {selectedProduct.stock}
            </p>

            <div className="form-group">
              <label>Nuevo Stock:</label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
                className="stock-input"
                placeholder="Ingrese el nuevo stock"
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() =>
                  actualizarStock(selectedProduct.idProducto, newStock)
                }
                className="btn-confirm"
              >
                ✅ Actualizar Stock
              </button>
              <button
                onClick={() => setShowStockModal(false)}
                className="btn-cancel"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content extra-large-modal">
            <h3>Editar Producto: {editingProduct.nombre}</h3>
            <form onSubmit={actualizarProducto}>
              <div className="form-section">
                <h4>Información Básica</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      value={editForm.nombre || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nombre: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Precio (S/.):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.precio || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, precio: e.target.value })
                      }
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    value={editForm.descripcion || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, descripcion: e.target.value })
                    }
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stock:</label>
                    <input
                      type="number"
                      value={editForm.stock || 0}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Categoría ID:</label>
                    <input
                      type="number"
                      value={editForm.idCategoria || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          idCategoria: parseInt(e.target.value),
                        })
                      }
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Proveedor ID:</label>
                    <input
                      type="number"
                      value={editForm.idProveedor || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          idProveedor: parseInt(e.target.value),
                        })
                      }
                      required
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Marca ID:</label>
                    <input
                      type="number"
                      value={editForm.idMarca || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          idMarca: parseInt(e.target.value),
                        })
                      }
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Gestión de Imágenes</h4>

                <div className="image-url-section">
                  <h5>Agregar nueva imagen</h5>
                  <div className="url-input-group">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="url-input"
                    />
                    <button
                      type="button"
                      onClick={agregarImagen}
                      className="btn-secondary"
                    >
                      ➕ Agregar
                    </button>
                  </div>
                  <small className="url-help">
                    Ingresa una URL válida que empiece con http:// o https://
                  </small>
                </div>

                <div className="existing-images-section">
                  <h5>
                    Imágenes del Producto (
                    {editForm.imagenesLocales
                      ? editForm.imagenesLocales.length
                      : 0}
                    )
                  </h5>
                  {editForm.imagenesLocales &&
                  editForm.imagenesLocales.length > 0 ? (
                    <div className="images-grid">
                      {editForm.imagenesLocales.map((imagen, index) => (
                        <div
                          key={imagen.idImagen || index}
                          className="image-item"
                        >
                          {/* ✅ USANDO ImagenConFallback EN EL MODAL */}
                          <ImagenConFallback
                            src={imagen.urlImagen}
                            alt={`Imagen ${index + 1} de ${
                              editingProduct.nombre
                            }`}
                            className="image-preview"
                            fallbackText="Error cargando imagen"
                          />
                          <div className="image-info">
                            <span className="image-index">#{index + 1}</span>
                            {imagen.principal === "S" && (
                              <span className="badge-principal">
                                ⭐ Principal
                              </span>
                            )}
                          </div>
                          <div className="image-actions">
                            {imagen.principal !== "S" && (
                              <button
                                type="button"
                                onClick={() => establecerImagenPrincipal(index)}
                                className="btn-set-main"
                              >
                                Hacer Principal
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                eliminarImagen(index, imagen.idImagen)
                              }
                              className="btn-delete"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-images-message">
                      No hay imágenes para este producto
                    </p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-confirm"
                  disabled={savingImages}
                >
                  {savingImages ? "💾 Guardando..." : "💾 Guardar Cambios"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn-cancel"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosList;
