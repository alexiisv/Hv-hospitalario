import { useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import { obtenerInventarioPorId } from "../services/inventarioService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function DetalleEquipo() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const hoja1Ref = useRef(null);
  const hoja2Ref = useRef(null);
  const hoja3Ref = useRef(null);

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  const cargarDetalle = async () => {
    try {
      const res = await obtenerInventarioPorId(id);
      setData(res);
    } catch (error) {
      console.error("Error al cargar detalle del equipo:", error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">Cargando hoja de vida...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <p className="text-slate-600">No se encontró información del equipo.</p>
      </div>
    );
  }

  const { equipo, actividades = [], recomendaciones = [] } = data;

  const actividadesCompletas = Array.from({ length: 11 }, (_, i) => {
    return actividades.find((a) => a.numero_actividad === i + 1) || null;
  });

  const recomendacionesCompletas = Array.from({ length: 4 }, (_, i) => {
    return recomendaciones.find((r) => r.numero_recomendacion === i + 1) || null;
  });

  const Box = ({ label, value, className = "", valueClassName = "" }) => (
    <div className={`grid grid-cols-[150px_1fr] border border-slate-300 ${className}`}>
      <div className="bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
        {label}
      </div>
      <div
        className={`px-3 py-2 text-[11px] text-slate-800 whitespace-pre-line ${valueClassName}`}
      >
        {value || "NA"}
      </div>
    </div>
  );

  const SmallBox = ({ label, value }) => (
    <div className="grid grid-cols-[120px_1fr] border border-slate-300">
      <div className="bg-slate-100 px-2 py-2 text-[10px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
        {label}
      </div>
      <div className="px-2 py-2 text-[11px] text-slate-800 whitespace-pre-line">
        {value || "NA"}
      </div>
    </div>
  );

 const PageWrapper = ({ children, innerRef }) => (
  <div
    ref={innerRef}
    className="mx-auto w-[794px] min-h-[1123px] bg-white border border-slate-300 shadow-sm p-6 print:shadow-none print:border-none"
  >
    {children}
  </div>
);

  // const HeaderDocumento = ({ titulo }) => (
  //   <div className="border border-slate-400 mb-4">
  //     <div className="grid grid-cols-[160px_1fr_140px] items-stretch min-h-[90px]">
  //       <div className="border-r border-slate-400 flex items-center justify-center p-3">
  //         {equipo.imagen_url ? (
  //           <img
  //             src={equipo.imagen_url}
  //             alt={equipo.equipo}
  //             className="max-h-[70px] object-contain"
  //           />
  //         ) : (
  //           <div className="text-[10px] text-slate-500 text-center">
  //             LOGO / IMAGEN
  //           </div>
  //         )}
  //       </div>

  //       <div className="flex flex-col items-center justify-center text-center px-4">
  //         <p className="text-[12px] font-semibold text-slate-700">
  //           E.S.E. CENTRO DE SALUD SANTIAGO APÓSTOL
  //         </p>
  //         <p className="text-[11px] font-semibold text-slate-600 mt-1">
  //           IMUES - NARIÑO
  //         </p>
  //         <p className="text-[13px] font-bold text-slate-700 mt-3 uppercase">
  //           {titulo}
  //         </p>
  //       </div>

  //       <div className="border-l border-slate-400 flex items-center justify-center px-3 text-[10px] text-slate-500">
  //         FORMATO V.: 1,0
  //       </div>
  //     </div>
  //   </div>
  // );

  const HeaderDocumento = ({ titulo }) => (
  <div className="border border-slate-400 mb-4">
    <div className="grid grid-cols-[160px_1fr_140px] items-stretch min-h-[95px]">
      <div className="border-r border-slate-400 flex items-center justify-center p-3">
        {equipo.ese_logo_url ? (
          <img
            src={equipo.ese_logo_url}
            alt={equipo.ese_nombre}
            className="max-h-[75px] max-w-full object-contain"
          />
        ) : (
          <div className="text-[10px] text-slate-500 text-center">
            LOGO ESE
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center text-center px-4">
        <p className="text-[12px] font-bold text-slate-700 uppercase">
          {equipo.ese_nombre || "NOMBRE DE LA ESE"}
        </p>

        <p className="text-[10px] font-medium text-slate-600 mt-1">
          {equipo.ese_ciudad || "Ciudad"} - {equipo.ese_departamento || "Departamento"}
        </p>

        <p className="text-[10px] text-slate-500">
          NIT: {equipo.ese_nit || "No registrado"}
        </p>

        <p className="text-[13px] font-bold text-slate-700 mt-3 uppercase">
          {titulo}
        </p>
      </div>

      <div className="border-l border-slate-400 flex flex-col items-center justify-center px-3 text-center">
        <p className="text-[10px] font-semibold text-slate-600">
          FORMATO
        </p>
        <p className="text-[10px] text-slate-500">
          V.: 1,0
        </p>
      </div>
    </div>
  </div>
);

const generarPDF = async () => {
  const pdf = new jsPDF("p", "mm", "a4");

  const hojas = [hoja1Ref.current, hoja2Ref.current, hoja3Ref.current];

  for (let i = 0; i < hojas.length; i++) {
    const hoja = hojas[i];

    const canvas = await html2canvas(hoja, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = 210;
    const pdfHeight = 297;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    if (i < hojas.length - 1) {
      pdf.addPage();
    }
  }

  pdf.save(`Hoja_vida_${equipo.codigo_inventario || equipo.id}.pdf`);
};


  return (
    
    <div className="space-y-8 pb-10">
          <div className="flex justify-end">
      {/* <button
        onClick={generarPDF}
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition"
      >
        Generar PDF
      </button> */}
    </div>
      {/* ============================= HOJA 1 ============================= */}
      <PageWrapper innerRef={hoja1Ref}>
        <HeaderDocumento titulo="Hoja de Vida Equipo Biomédico" />

        <section className="mb-4">
          <div className="border border-slate-300">
            <div className="bg-white px-3 -mt-3 ml-3 w-fit text-slate-600 font-semibold text-[12px] uppercase">
              Características del equipo
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-4 p-3">
              <div className="space-y-0">
                <div className="grid grid-cols-3 gap-0">
                  <Box label="Nombre" value={equipo.equipo} className="col-span-2" />
                  <Box label="Ubicación" value={equipo.ubicacion} />
                </div>

                <Box label="Área" value={equipo.area} />

                <div className="border border-slate-300 grid grid-cols-[150px_1fr]">
                  <div className="bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
                    Descripción
                  </div>
                  <div className="px-3 py-2 text-[11px] text-slate-800 min-h-[70px] whitespace-pre-line">
                    {equipo.descripcion || "NA"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-0">
                  <Box label="Marca" value={equipo.marca} />
                  <Box label="Fecha fabricación" value={equipo.fecha_fabricacion} />
                  <Box label="Modelo" value={equipo.modelo} />
                  <Box label="Fecha instalación" value={equipo.fecha_instalacion} />
                  <Box label="Serie" value={equipo.serie} />
                  <Box label="Garantía" value={equipo.garantia} />
                  <Box label="Referencia" value={equipo.referencia} />
                  <Box label="INVIMA" value={equipo.invima} />
                  <Box label="Manual" value={equipo.manual} />
                  <Box label="Forma adquisición" value={equipo.forma_adquisicion} />
                  <Box label="País fabric." value={equipo.pais_fabricacion} />
                  <Box label="Proveedor" value={equipo.proveedor} />
                </div>
              </div>

              <div className="border border-slate-300 flex items-center justify-center p-3 min-h-[250px] bg-white">
                {equipo.imagen_url ? (
                  <img
                    src={equipo.imagen_url}
                    alt={equipo.equipo}
                    className="max-h-[220px] max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-slate-500">Sin imagen</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-4">
          <div className="border border-slate-300">
            <div className="bg-white px-3 -mt-3 ml-3 w-fit text-slate-600 font-semibold text-[12px] uppercase">
              Características técnicas
            </div>

            <div className="p-3 space-y-0">
              <div className="grid grid-cols-3 gap-0">
                <SmallBox label="Ancho (cm)" value={equipo.ancho} />
                <SmallBox label="Resolución" value={equipo.resolucion} />
                <SmallBox label="Peso" value={equipo.peso} />
                <SmallBox label="Alto (cm)" value={equipo.alto} />
                <SmallBox label="Capacidad" value={equipo.capacidad} />
                <SmallBox label="Fuente alimentac" value={equipo.fuente_alimentacion} />
                <SmallBox label="Pantalla" value={equipo.pantalla} />
                <SmallBox label="Voltaje" value={equipo.voltaje} />
                <SmallBox label="Potencia" value={equipo.potencia} />
              </div>

              <Box label="Fondo (cm)" value={equipo.fondo} />

              <div className="border border-slate-300 grid grid-cols-[150px_1fr]">
                <div className="bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
                  Otras especificaciones
                </div>
                <div className="px-3 py-2 text-[11px] text-slate-800 min-h-[110px] whitespace-pre-line">
                  {equipo.otras_especificaciones || "NA"}
                </div>
              </div>

              <Box label="Código inventario" value={equipo.codigo_inventario} />
            </div>
          </div>
        </section>

        <section className="mb-4">
          <div className="border border-slate-300">
            <div className="bg-white px-3 -mt-3 ml-3 w-fit text-slate-600 font-semibold text-[12px] uppercase">
              Apoyo técnico
            </div>

            <div className="p-3 grid grid-cols-2 gap-0">
              <Box label="Uso" value={equipo.uso} />
              <Box label="Clasificación biomédica" value={equipo.clasificacion_biomedica} />
              <Box label="Riesgo" value={equipo.riesgo} />
              <Box label="Tecnología predominante" value={equipo.tecnologia_predominante} />
              <Box label="Tipo equipo" value={equipo.tipo_equipo} />
              <Box label="Estado equipo" value={equipo.estado_equipo} />
            </div>
          </div>
        </section>

        <section>
          <div className="border border-slate-300">
            <div className="bg-white px-3 -mt-3 ml-3 w-fit text-slate-600 font-semibold text-[12px] uppercase">
              Recomendaciones del fabricante
            </div>

            <div className="p-3 space-y-0">
              {recomendacionesCompletas.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[35px_1fr] border border-slate-300"
                >
                  <div className="bg-white px-2 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 text-center">
                    {index + 1}
                  </div>
                  <div className="px-3 py-2 text-[11px] text-slate-800 min-h-[42px] whitespace-pre-line">
                    {item?.recomendacion || ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
              <div className="border border-slate-400 mt-4">
            <div className="bg-slate-100 border-b border-slate-400 px-3 py-2 text-center text-xs font-bold uppercase text-slate-700">
              Accesorios
            </div>

            <div className="min-h-[90px] p-3 text-sm text-slate-700 whitespace-pre-line">
              {equipo.accesorios || "NA"}
            </div>
          </div>
        </section>
      </PageWrapper>

      {/* ============================= HOJA 2 ============================= */}
      <PageWrapper innerRef={hoja2Ref}>
        <HeaderDocumento titulo="Hoja de Vida Equipo Biomédico" />

        <section>
          <div className="border border-slate-300">
            <div className="bg-white px-3 -mt-3 ml-3 w-fit text-slate-600 font-semibold text-[12px] uppercase">
              Protocolo de mantenimiento preventivo
            </div>

            <div className="p-3">
              <div className="grid grid-cols-2 gap-0 mb-3">
                <Box label="Equipo" value={equipo.equipo} />
                <Box label="Ubicación" value={equipo.ubicacion} />
                <Box label="Marca" value={equipo.marca} />
                <Box label="Estado equipo" value={equipo.estado_equipo} />
                <Box label="Modelo" value={equipo.modelo} />
                <Box label="Frecuencia mantenim" value={equipo.frecuencia_mantenimiento} />
                <Box label="Serie" value={equipo.serie} />
                <div className="border border-slate-300">
                  {/* <div className="bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 text-center uppercase border-b border-slate-300">
                    Revisión
                  </div> */}
                  
                </div>
              </div>

              <div className="border border-slate-300">
                <div className="grid grid-cols-[40px_1fr_70px_70px_70px] bg-slate-100 text-[10px] font-semibold text-slate-700 uppercase">
                  <div className="border-r border-slate-300 px-2 py-2 text-center">#</div>
                  <div className="border-r border-slate-300 px-2 py-2">Actividades a realizar</div>
                  <div className="border-r border-slate-300 px-2 py-2 text-center">1</div>
                  <div className="border-r border-slate-300 px-2 py-2 text-center">2</div>
                  <div className="px-2 py-2 text-center">3</div>
                </div>

                {actividadesCompletas.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[40px_1fr_70px_70px_70px] text-[11px] text-slate-800"
                  >
                    <div className="border-t border-r border-slate-300 px-2 py-2 text-center">
                      {index + 1}
                    </div>
                    <div className="border-t border-r border-slate-300 px-2 py-2 min-h-[38px]">
                      {item?.actividad || "-"}
                    </div>
                    <div className="border-t border-r border-slate-300 min-h-[38px]" />
                    <div className="border-t border-r border-slate-300 min-h-[38px]" />
                    <div className="border-t border-slate-300 min-h-[38px]" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-0 mt-3">
                <div className="border border-slate-300">
                  <div className="bg-slate-100 text-center text-[10px] font-semibold text-slate-700 uppercase px-2 py-2 border-b border-slate-300">
                    Relación de herramientas, equipos e insumos
                  </div>
                  <div className="min-h-[70px]" />
                </div>
                <div className="border border-slate-300">
                  <div className="bg-slate-100 text-center text-[10px] font-semibold text-slate-700 uppercase px-2 py-2 border-b border-slate-300">
                    Repuestos
                  </div>
                  <div className="min-h-[70px]" />
                </div>
              </div>

              <div className="border border-slate-300 mt-3">
                <div className="bg-slate-100 text-center text-[10px] font-semibold text-slate-700 uppercase px-2 py-2 border-b border-slate-300">
                  Observaciones o reporte de fallas
                </div>
                <div className="space-y-0">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="grid grid-cols-[80px_1fr]">
                      <div className="border-r border-t border-slate-300 text-[10px] text-slate-400 px-2 py-2">
                        D/M/AA
                      </div>
                      <div className="border-t border-slate-300 min-h-[34px]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-300 mt-3">
                <div className="grid grid-cols-[160px_1fr_1fr_1fr] text-[10px] font-semibold text-slate-700 uppercase">
                  <div className="bg-slate-100 border-r border-slate-300 px-2 py-2 text-center">
                    Fecha revisión
                  </div>
                  <div className="border-r border-slate-300 px-2 py-2 text-center text-slate-400">
                    D/M/AA
                  </div>
                  <div className="border-r border-slate-300 px-2 py-2 text-center text-slate-400">
                    D/M/AA
                  </div>
                  <div className="px-2 py-2 text-center text-slate-400">D/M/AA</div>
                </div>

                <div className="grid grid-cols-[160px_1fr_1fr_1fr] text-[10px]">
                  <div className="bg-slate-100 border-r border-t border-slate-300 px-2 py-3 text-center font-semibold text-slate-700 uppercase">
                    Realizado
                  </div>
                  <div className="border-r border-t border-slate-300 min-h-[34px]" />
                  <div className="border-r border-t border-slate-300 min-h-[34px]" />
                  <div className="border-t border-slate-300 min-h-[34px]" />
                </div>

                <div className="grid grid-cols-[160px_1fr_1fr_1fr] text-[10px]">
                  <div className="bg-slate-100 border-r border-t border-slate-300 px-2 py-3 text-center font-semibold text-slate-700 uppercase">
                    Recibido
                  </div>
                  <div className="border-r border-t border-slate-300 min-h-[34px]" />
                  <div className="border-r border-t border-slate-300 min-h-[34px]" />
                  <div className="border-t border-slate-300 min-h-[34px]" />
                </div>

                <div className="grid grid-cols-[160px_1fr_1fr_1fr] text-[10px]">
                  <div className="bg-slate-100 border-r border-t border-slate-300 px-2 py-3 text-center font-semibold text-slate-700 uppercase">
                    Tiempo de ej
                  </div>
                  <div className="border-r border-t border-slate-300 min-h-[34px]" />
                  <div className="border-r border-t border-slate-300 min-h-[34px]" />
                  <div className="border-t border-slate-300 min-h-[34px]" />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                Nota: El protocolo de mantenimiento preventivo incluye las recomendaciones
                establecidas por el fabricante, en caso de no encontrarse se adoptan del
                programa de mantenimiento definido por guías, manuales y estándares del
                área de mantenimiento Hospitalario.
              </p>
            </div>
          </div>
        </section>
      </PageWrapper>

      {/* ============================= HOJA 3 ============================= */}
      <PageWrapper innerRef={hoja3Ref}>
        <HeaderDocumento titulo="Hoja de Vida Equipo Biomédico" />

        <section>
          <div className="border border-slate-300">
            <div className="bg-white px-3 -mt-3 ml-3 w-fit text-slate-600 font-semibold text-[12px] uppercase">
              Formato de mantenimiento correctivo
            </div>

            <div className="p-3 space-y-3">
              <div className="grid grid-cols-2 gap-0">
                <Box label="Equipo" value={equipo.equipo} />
                <Box label="Ubicación" value={equipo.ubicacion} />
                <Box label="Marca" value={equipo.marca} />
                <Box label="Área" value={equipo.area} />
                <Box label="Modelo" value={equipo.modelo} />
                <Box label="Código inventario" value={equipo.codigo_inventario} />
                <Box label="Serie" value={equipo.serie} />
                <Box label="Estado equipo" value={equipo.estado_equipo} />
              </div>

              <div className="grid grid-cols-2 gap-0">
                <Box label="Fecha reporte" value="" />
                <Box label="Reportado por" value="" />
              </div>

              <div className="border border-slate-300 grid grid-cols-[170px_1fr]">
                <div className="bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
                  Falla reportada
                </div>
                <div className="min-h-[70px]" />
              </div>

              <div className="border border-slate-300 grid grid-cols-[170px_1fr]">
                <div className="bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
                  Diagnóstico técnico
                </div>
                <div className="min-h-[90px]" />
              </div>

              <div className="border border-slate-300 grid grid-cols-[170px_1fr]">
                <div className="bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
                  Actividades realizadas
                </div>
                <div className="min-h-[100px]" />
              </div>

              <div className="grid grid-cols-2 gap-0">
                <div className="border border-slate-300">
                  <div className="bg-slate-100 text-center text-[10px] font-semibold text-slate-700 uppercase px-2 py-2 border-b border-slate-300">
                    Repuestos utilizados
                  </div>
                  <div className="min-h-[90px]" />
                </div>
                <div className="border border-slate-300">
                  <div className="bg-slate-100 text-center text-[10px] font-semibold text-slate-700 uppercase px-2 py-2 border-b border-slate-300">
                    Pruebas realizadas
                  </div>
                  <div className="min-h-[90px]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0">
                <Box label="Resultado final" value="" />
                <Box label="Estado final equipo" value="" />
              </div>

              <div className="border border-slate-300 grid grid-cols-[170px_1fr]">
                <div className="bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
                  Recomendaciones posteriores
                </div>
                <div className="min-h-[70px]" />
              </div>

              <div className="grid grid-cols-2 gap-0">
                <Box label="Fecha cierre" value="" />
                <Box label="Tiempo ejecución" value="" />
                <Box label="Técnico responsable" value="" />
                <Box label="Recibido por" value="" />
              </div>

              <div className="border border-slate-300 grid grid-cols-[170px_1fr]">
                <div className="bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 border-r border-slate-300 uppercase">
                  Observaciones
                </div>
                <div className="min-h-[70px]" />
              </div>
            </div>
          </div>
        </section>
      </PageWrapper>
    </div>
  );
}