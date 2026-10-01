"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAdmin } from '../actions';
import {
  FilePlus,
  LogOut,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Newspaper,
  Eye,
  Trash2,
  Pencil,
  Sparkles,
  X,
} from 'lucide-react';
import { BlogCategory, BLOG_CATEGORIES } from '@/lib/blog';

interface PostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  image: string;
  content: string[] | string;
  author?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Studio Journal');
  const [author, setAuthor] = useState('Alexandra Robles');
  const [date, setDate] = useState('');
  const [readTime, setReadTime] = useState('4 min read');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<{ name: string; base64: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (activeTab === 'view') {
      fetchArticles();
    }
  }, [activeTab]);

  const fetchArticles = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/admin-posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error cargando posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin');
    router.refresh();
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setCategory('Studio Journal');
    setAuthor('Alexandra Robles');
    setDate('');
    setReadTime('4 min read');
    setExcerpt('');
    setContent('');
    setCurrentImageUrl('');
    setImageFile(null);
    setIsEditing(false);
    setEditingSlug(null);
    setStatus({ type: null, message: '' });

    const fileInput = document.getElementById('featured-image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const startEditPost = (post: PostRecord) => {
    setIsEditing(true);
    setEditingSlug(post.slug);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category || 'Studio Journal');
    setAuthor(post.author || 'Alexandra Robles');
    setDate(post.date || '');
    setReadTime(post.readTime || '4 min read');
    setExcerpt(post.excerpt || '');

    if (Array.isArray(post.content)) {
      setContent(post.content.join('\n\n'));
    } else {
      setContent(post.content || '');
    }

    setCurrentImageUrl(post.image || '');
    setImageFile(null);
    setStatus({ type: null, message: '' });
    setActiveTab('create');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);

    if (!isEditing) {
      const suggestedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(suggestedSlug);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const cleanBase64 = base64String.split(',')[1];
      setImageFile({ name: file.name, base64: cleanBase64 });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (postSlug: string, postTitle: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el artículo "${postTitle}"? Esta acción no se puede deshacer.`
    );
    if (!confirmDelete) return;

    setDeletingSlug(postSlug);
    try {
      const res = await fetch('/api/admin-posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: postSlug }),
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== postSlug));
        if (editingSlug === postSlug) {
          resetForm();
        }
      } else {
        const data = await res.json();
        alert(data.error || 'No se pudo eliminar el artículo.');
      }
    } catch (err) {
      console.error('Error eliminando post:', err);
      alert('Ocurrió un error al intentar eliminar el artículo.');
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    if (!isEditing && !imageFile && !currentImageUrl) {
      setStatus({
        type: 'error',
        message: 'Por favor, selecciona una imagen destacada desde tu computadora.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        title,
        slug,
        originalSlug: isEditing ? editingSlug : undefined,
        category,
        author,
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime,
        excerpt,
        content,
        image: currentImageUrl,
      };

      if (imageFile) {
        payload.imageName = imageFile.name;
        payload.imageBase64 = imageFile.base64;
      }

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar el artículo.');

      setStatus({
        type: 'success',
        message: isEditing
          ? `¡Artículo "${title}" actualizado con éxito!`
          : `¡Publicación creada con éxito! Slug: ${data.slug}`,
      });

      fetchArticles();

      if (!isEditing) {
        resetForm();
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Ocurrió un error inesperado.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex font-sans bg-slate-50 text-slate-800">
      {/* SIDEBAR DEL PORTAL */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 hidden md:flex shrink-0 shadow-xs sticky top-[57px] h-[calc(100vh-57px)]">
        <nav className="space-y-2 flex-grow pt-2">
          <button
            onClick={() => {
              setActiveTab('create');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'bg-[#9e8b43] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FilePlus size={16} />
            <span>{isEditing ? 'Editar Artículo' : 'Crear Artículo'}</span>
          </button>

          <button
            onClick={() => setActiveTab('view')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'view'
                ? 'bg-[#9e8b43] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Newspaper size={16} />
            <span>Ver Artículos ({posts.length})</span>
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl font-medium text-xs uppercase tracking-wider transition-colors mt-auto group cursor-pointer"
        >
          <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow p-6 md:p-12 max-w-5xl overflow-y-auto">
        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-widest text-sm text-slate-900">Alexpoeima CMS</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 text-xs font-bold uppercase"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* MOBILE TABS */}
        <div className="md:hidden flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
              activeTab === 'create' ? 'bg-[#9e8b43] text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {isEditing ? 'Editar' : 'Crear'}
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
              activeTab === 'view' ? 'bg-[#9e8b43] text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Ver ({posts.length})
          </button>
        </div>

        {/* TAB 1: CREAR / EDITAR ARTÍCULO */}
        {activeTab === 'create' && (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                  {isEditing ? 'Editar Artículo de Blog' : 'Nuevo Artículo de Blog'}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Completa los campos para publicar en la revista digital &quot;Between Brushstrokes&quot;.
                </p>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <X size={14} />
                  <span>Cancelar Edición</span>
                </button>
              )}
            </div>

            {status.type && (
              <div
                className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-xs ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                )}
                <span className="leading-relaxed">{status.message}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Título de la Publicación
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#9e8b43] focus:bg-white transition-all placeholder-slate-400"
                    placeholder="ej. The Meaning Behind 'Poiema'"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BlogCategory)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#9e8b43] focus:bg-white transition-all cursor-pointer"
                  >
                    {BLOG_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat} className="bg-white text-slate-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#9e8b43] focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Fecha
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#9e8b43] focus:bg-white transition-all placeholder-slate-400"
                    placeholder="October 1, 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Tiempo de Lectura
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#9e8b43] focus:bg-white transition-all"
                    placeholder="4 min read"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  URL Slug (SEO)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:border-[#9e8b43] focus:bg-white transition-all placeholder-slate-400"
                  placeholder="the-meaning-behind-poiema"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Dirección web final: alexpoeima.com/blog/{slug || '...'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Excerpt (Resumen Corto para la Grilla)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#9e8b43] focus:bg-white transition-all placeholder-slate-400"
                  placeholder="Escribe una breve introducción o síntesis del artículo..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Imagen Destacada (Desde tu Computadora)
                </label>

                {currentImageUrl && !imageFile && (
                  <div className="mb-3 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentImageUrl}
                      alt="Actual"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                    />
                    <div>
                      <p className="text-slate-800 font-semibold">Imagen actual del artículo</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-xs">{currentImageUrl}</p>
                    </div>
                  </div>
                )}

                <div className="relative flex items-center justify-center w-full bg-slate-50 border border-dashed border-slate-300 hover:border-[#9e8b43] transition-colors rounded-2xl p-6">
                  <input
                    type="file"
                    id="featured-image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="text-center flex flex-col items-center gap-2">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-[#9e8b43] shadow-xs">
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {imageFile
                        ? `✓ Archivo seleccionado: ${imageFile.name}`
                        : isEditing
                        ? "Haz clic para reemplazar la imagen (opcional)"
                        : "Haz clic para subir imagen o arrastra el archivo aquí"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Contenido del Post (Separa párrafos con doble salto de línea)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans text-slate-800 focus:outline-none focus:border-[#9e8b43] focus:bg-white transition-all placeholder-slate-400 leading-relaxed"
                  placeholder="Escribe aquí los párrafos del artículo. Puedes separar cada párrafo dejando una línea en blanco."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer border border-slate-200"
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#9e8b43] hover:bg-[#8a7833] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>{isEditing ? 'Guardar Cambios' : 'Publicar Artículo'}</span>
                </button>
              </div>
            </form>
          </>
        )}

        {/* TAB 2: VER ARTÍCULOS PUBLICADOS */}
        {activeTab === 'view' && (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                  Artículos Publicados
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Gestión unificada de historias y ensayos en Alexpoeima.
                </p>
              </div>
            </div>

            {loadingPosts ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-xs">
                <Loader2 size={32} className="animate-spin text-[#9e8b43] mb-2" />
                <p className="text-xs text-slate-500">Consultando catálogo de artículos...</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 sm:p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Título del Artículo
                        </th>
                        <th className="p-4 sm:p-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-36">
                          Categoría
                        </th>
                        <th className="p-4 sm:p-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-36">
                          Fecha
                        </th>
                        <th className="p-4 sm:p-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-36 text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {posts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-400 text-xs">
                            No se encontraron artículos.
                          </td>
                        </tr>
                      ) : (
                        posts.map((post) => (
                          <tr key={post.slug} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 sm:p-5 font-semibold text-slate-900">
                              <div className="line-clamp-1">{post.title}</div>
                              <div className="text-[11px] font-mono text-slate-400 font-normal">
                                /{post.slug}
                              </div>
                            </td>
                            <td className="p-4 sm:p-5">
                              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#9e8b43]/15 text-[#9e8b43] border border-[#9e8b43]/30">
                                {post.category || 'Studio'}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-slate-500 font-mono text-xs whitespace-nowrap">
                              {post.date}
                            </td>
                            <td className="p-4 sm:p-5">
                              <div className="flex items-center justify-center gap-2">
                                {/* Ver en vivo */}
                                <a
                                  href={`/blog/${post.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-[#9e8b43] rounded-lg transition-colors cursor-pointer"
                                  title="Ver post en vivo"
                                >
                                  <Eye size={16} />
                                </a>

                                {/* Editar */}
                                <button
                                  onClick={() => startEditPost(post)}
                                  className="p-2 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-lg transition-colors cursor-pointer"
                                  title="Editar artículo"
                                >
                                  <Pencil size={16} />
                                </button>

                                {/* Eliminar */}
                                <button
                                  onClick={() => handleDelete(post.slug, post.title)}
                                  disabled={deletingSlug === post.slug}
                                  className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                  title="Eliminar artículo"
                                >
                                  {deletingSlug === post.slug ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
