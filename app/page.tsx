import Link from "next/link";
import {
  ArrowRight,
  Layout,
  Layers,
  Move,
  Sparkles,
  Type,
  Zap,
  Check,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F172A] overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#14B8A6] flex items-center justify-center shadow-md">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Studio Álbum</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#0F172A]/60">
          <a href="#features" className="hover:text-[#0F172A] transition-colors">Funciones</a>
          <a href="#pricing" className="hover:text-[#0F172A] transition-colors">Precios</a>
          <a href="#preview" className="hover:text-[#0F172A] transition-colors">Vista previa</a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="hidden sm:block text-sm font-medium text-[#0F172A]/60 hover:text-[#0F172A] transition-colors"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/editor"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1e293b] transition-colors shadow-md"
          >
            Empezar gratis
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 md:px-12 relative">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#FF6B6B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] text-xs font-semibold tracking-wide mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Presentamos Studio Álbum 1.0
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            Disena albumes de fotos{" "}
            <span className="bg-gradient-to-r from-[#FF6B6B] to-[#14B8A6] bg-clip-text text-transparent">
              que amaras para siempre.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#0F172A]/50 max-w-2xl mx-auto leading-relaxed mb-10">
            Un editor potente basado en lienzo que te permite crear,
            disenar y exportar albumes hermosos sin esfuerzo, de la idea a la impresion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/editor"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0F172A] text-white font-semibold text-base hover:bg-[#1e293b] transition-all shadow-xl shadow-[#0F172A]/20"
            >
              Abrir editor
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#preview"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#0F172A]/10 text-[#0F172A]/70 font-semibold text-base hover:border-[#0F172A]/20 hover:text-[#0F172A] transition-all"
            >
              Ver vista previa
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-[#0F172A]/40">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FF6B6B] text-[#FF6B6B]" />
              ))}
            </div>
            <span>Elegido por mas de 2,400 creadores</span>
            <span className="hidden sm:block">•</span>
            <span className="hidden sm:block">No requiere tarjeta de credito</span>
          </div>
        </div>

        {/* Hero mockup */}
        <div id="preview" className="max-w-5xl mx-auto mt-16 relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-[#0F172A]/20 border border-black/5">
            <div className="bg-[#0F172A] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4 bg-white/5 rounded-md h-6 flex items-center px-3">
                <span className="text-white/30 text-xs">studio-album.app/editor</span>
              </div>
            </div>
            <div className="bg-[#0D1525] flex" style={{ minHeight: 400 }}>
              <div className="w-48 bg-[#0F172A] border-r border-white/10 p-3 space-y-2">
                {["Subir imagen", "Agregar texto"].map((label) => (
                  <div key={label} className="h-8 rounded-lg bg-white/5 flex items-center px-3 gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#FF6B6B]/50" />
                    <span className="text-white/40 text-xs">{label}</span>
                  </div>
                ))}
                <div className="pt-3 grid grid-cols-2 gap-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg"
                      style={{ background: `linear-gradient(135deg, hsl(${i * 60 + 10},60%,65%), hsl(${i * 60 + 40},70%,55%))`, opacity: 0.7 }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-64 h-80 bg-white rounded-lg relative overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                  <div className="w-full h-40 bg-gradient-to-br from-[#FF6B6B]/80 to-[#14B8A6]/80" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-[#0F172A]/10 rounded" />
                    <div className="h-3 w-1/2 bg-[#0F172A]/5 rounded" />
                  </div>
                  <div className="absolute border-2 border-[#FF6B6B] rounded pointer-events-none" style={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                    {["top-left","top-right","bottom-left","bottom-right"].map((pos) => (
                      <div key={pos} className={`absolute w-3 h-3 bg-white border-2 border-[#FF6B6B] rounded-sm ${pos.includes("top") ? "-top-1.5" : "-bottom-1.5"} ${pos.includes("left") ? "-left-1.5" : "-right-1.5"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-32 bg-[#0a0f1e] border-l border-white/10 p-2 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`aspect-[0.707] rounded-md border-2 flex items-center justify-center ${i === 0 ? "border-[#FF6B6B]" : "border-transparent bg-white/5"}`}>
                    <span className="text-white/20 text-xs">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#FF6B6B] font-semibold text-sm tracking-wide mb-3">TODO LO QUE NECESITAS</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Disenado para creadores.</h2>
            <p className="text-[#0F172A]/50 text-lg max-w-xl mx-auto">
              Herramientas potentes dentro de una interfaz limpia e intuitiva que no estorba tu flujo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="p-6 rounded-2xl bg-[#FAFAF9] border border-black/5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-[#0F172A]/50 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 md:px-12 bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#14B8A6] font-semibold text-sm tracking-wide mb-3">PRECIOS SIMPLES</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Empieza gratis. Escala cuando quieras.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map(({ name, price, description, features, highlight, cta }) => (
              <div key={name} className={`relative p-8 rounded-2xl border-2 flex flex-col ${highlight ? "border-[#FF6B6B] bg-[#0F172A] text-white shadow-2xl shadow-[#FF6B6B]/10 md:-mt-6" : "border-black/10 bg-white"}`}>
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B6B] text-white text-xs font-bold">MAS POPULAR</div>
                )}
                <div className="mb-6">
                  <p className={`text-sm font-semibold mb-1 ${highlight ? "text-[#FF6B6B]" : "text-[#0F172A]/50"}`}>{name}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold">{price}</span>
                    {price !== "Gratis" && <span className={`text-sm ${highlight ? "text-white/50" : "text-[#0F172A]/40"}`}>/mes</span>}
                  </div>
                  <p className={`text-sm ${highlight ? "text-white/60" : "text-[#0F172A]/50"}`}>{description}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#14B8A6]" />
                      <span className={`text-sm ${highlight ? "text-white/80" : "text-[#0F172A]/70"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/editor" className={`text-center py-3 rounded-xl font-semibold text-sm transition-all ${highlight ? "bg-[#FF6B6B] text-white hover:bg-[#ff5252]" : "bg-[#0F172A] text-white hover:bg-[#1e293b]"}`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF6B6B]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#14B8A6]/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">Tus recuerdos merecen lo mejor.</h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Unete a miles de creadores que usan Studio Álbum para convertir sus fotos en recuerdos eternos.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white font-bold text-base hover:opacity-90 transition-opacity shadow-xl shadow-[#FF6B6B]/30"
          >
            Crea tu primer album, es gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-12 bg-[#0a0f1e] border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#14B8A6] flex items-center justify-center">
              <Layers className="w-3 h-3 text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium">Studio Álbum</span>
          </div>
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} Studio Álbum. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-white/40 text-xs">
            <a href="#" className="hover:text-white/70 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terminos</a>
            <a href="#" className="hover:text-white/70 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: Layout, title: "Editor de lienzo", description: "Un editor de arrastrar y soltar con renderizado en tiempo real, creado para albumes de fotos.", color: "#FF6B6B" },
  { icon: Move, title: "Mover, redimensionar y rotar", description: "Control total de elementos: mueve, escala, rota y superpone imagenes y texto con precision de pixeles.", color: "#14B8A6" },
  { icon: Type, title: "Edicion de texto enriquecido", description: "Agrega texto con estilo y personaliza fuentes, colores, tamanos y alineacion en cada pagina.", color: "#8B5CF6" },
  { icon: Layers, title: "Diseno multipagina", description: "Crea albumes con paginas ilimitadas, navega con una tira visual y reordena paginas facilmente.", color: "#F59E0B" },
  { icon: Zap, title: "Deshacer / rehacer + autoguardado", description: "No pierdas tu trabajo. El historial completo y el autoguardado local mantienen tu progreso seguro.", color: "#3B82F6" },
];

const PLANS = [
  { name: "Gratis", price: "Gratis", description: "Para aficionados que estan empezando", highlight: false, cta: "Comenzar", features: ["Hasta 3 albumes", "20 paginas por album", "Herramientas basicas de imagen", "Exportacion PDF", "Autoguardado local"] },
    { name: "Gratis", price: "Gratis", description: "Para aficionados que estan empezando", highlight: false, cta: "Comenzar", features: ["Hasta 3 albumes", "20 paginas por album", "Herramientas basicas de imagen", "Autoguardado local"] },
  { name: "Pro", price: "$9", description: "Para creadores profesionales", highlight: true, cta: "Probar Pro gratis", features: ["Albumes ilimitados", "Paginas ilimitadas", "Edicion avanzada de imagen", "Exportacion PDF en alta resolucion", "Fuentes personalizadas", "Sincronizacion en la nube", "Soporte prioritario"] },
    { name: "Pro", price: "$9", description: "Para creadores profesionales", highlight: true, cta: "Probar Pro gratis", features: ["Albumes ilimitados", "Paginas ilimitadas", "Edicion avanzada de imagen", "Fuentes personalizadas", "Sincronizacion en la nube", "Soporte prioritario"] },
  { name: "Studio", price: "$29", description: "Para estudios y equipos", highlight: false, cta: "Contactar ventas", features: ["Todo lo de Pro", "Colaboracion en equipo", "Kit de marca", "Acceso API", "Soporte dedicado", "Integraciones personalizadas"] },
];
