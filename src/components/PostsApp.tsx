import { useMemo, useState, useEffect, type FormEvent } from 'react'
import Loader from './Loader'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

interface PostDraft {
  title: string
  body: string
  userId: string
}

const emptyDraft: PostDraft = {
  title: '',
  body: '',
  userId: '1'
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

async function getPosts(): Promise<Post[]> {
  return requestJson<Post[]>('/posts')
}

async function createPost(payload: Omit<Post, 'id'>): Promise<Post> {
  return requestJson<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

async function updatePost(postId: number, payload: Post): Promise<Post> {
  return requestJson<Post>(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

async function removePost(postId: number): Promise<void> {
  await requestJson<void>(`/posts/${postId}`, {
    method: 'DELETE'
  })
}

function PostsApp() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filterUserId, setFilterUserId] = useState('')
  const [draft, setDraft] = useState<PostDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<number | null>(null)

  const filteredPosts = useMemo(() => {
    if (!filterUserId.trim()) {
      return posts
    }

    const parsed = Number(filterUserId)
    if (!Number.isFinite(parsed)) {
      return posts
    }

    return posts.filter((post) => post.userId === parsed)
  }, [posts, filterUserId])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPosts()
        setPosts(data)
      } catch {
        setError('No se pudieron cargar los posts. Intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const resetDraft = () => {
    setDraft(emptyDraft)
    setEditingId(null)
  }

  const handleRefresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPosts()
      setPosts(data)
    } catch {
      setError('No se pudieron actualizar los posts.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = draft.title.trim()
    const body = draft.body.trim()
    const userIdValue = Number(draft.userId)

    if (!title || !body || !Number.isFinite(userIdValue) || userIdValue <= 0) {
      setError('Completa todos los campos con datos validos.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (editingId) {
        const updated = await updatePost(editingId, {
          id: editingId,
          title,
          body,
          userId: userIdValue
        })

        setPosts((prev) => prev.map((post) => (post.id === editingId ? updated : post)))
        resetDraft()
      } else {
        const created = await createPost({
          title,
          body,
          userId: userIdValue
        })

        setPosts((prev) => [created, ...prev])
        resetDraft()
      }
    } catch {
      setError('No se pudo guardar el post.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (post: Post) => {
    setEditingId(post.id)
    setDraft({
      title: post.title,
      body: post.body,
      userId: String(post.userId)
    })
  }

  const handleDelete = async (postId: number) => {
    setDeletingId(postId)
    setError(null)
    try {
      await removePost(postId)
      setPosts((prev) => prev.filter((post) => post.id !== postId))

      if (editingId === postId) {
        resetDraft()
      }
    } catch {
      setError('No se pudo eliminar el post.')
    } finally {
      setDeletingId(null)
    }
  }

  const showInitialLoader = loading && posts.length === 0

  return (
    <div className="min-h-dvh bg-linear-to-br from-amber-50 via-white to-cyan-50 px-4 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg shadow-amber-100/60 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">JSONPlaceholder</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">Panel de posts</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Consume la API publica para listar, crear, actualizar y eliminar posts. Los cambios se simulan en el
            servidor, asi que actualiza la lista cuando quieras ver el estado original.
          </p>
          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-cyan-100/50 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingId ? `Editar post #${editingId}` : 'Crear nuevo post'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Completa los campos para enviar el post.</p>
              </div>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetDraft}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                >
                  Cancelar
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Titulo
                <input
                  type="text"
                  value={draft.title}
                  onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Ej: Post de prueba"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-200 transition focus:ring"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Contenido
                <textarea
                  value={draft.body}
                  onChange={(event) => setDraft((prev) => ({ ...prev, body: event.target.value }))}
                  placeholder="Describe el contenido del post"
                  rows={4}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-200 transition focus:ring"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Usuario (ID)
                <input
                  type="number"
                  min={1}
                  value={draft.userId}
                  onChange={(event) => setDraft((prev) => ({ ...prev, userId: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-200 transition focus:ring"
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Guardando...' : editingId ? 'Actualizar post' : 'Crear post'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-cyan-100/50 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Listado de posts</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Total: {posts.length} · Visibles: {filteredPosts.length}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Usuario
                  <input
                    type="number"
                    min={1}
                    value={filterUserId}
                    onChange={(event) => setFilterUserId(event.target.value)}
                    className="w-20 bg-transparent text-xs font-semibold text-slate-700 outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-800 transition hover:border-amber-300 hover:bg-amber-200"
                >
                  Actualizar
                </button>
              </div>
            </div>

            <div className="mt-6">
              {showInitialLoader ? (
                <Loader message="Cargando posts..." />
              ) : filteredPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                  No hay posts que coincidan con el filtro.
                </div>
              ) : (
                <ul className="grid gap-4">
                  {filteredPosts.map((post) => (
                    <li
                      key={post.id}
                      className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Post #{post.id} · Usuario {post.userId}
                          </p>
                          <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                          <p className="text-sm text-slate-600">{post.body}</p>
                        </div>
                        <div className="flex flex-row gap-2 sm:flex-col">
                          <button
                            type="button"
                            onClick={() => handleEdit(post)}
                            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {deletingId === post.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PostsApp
