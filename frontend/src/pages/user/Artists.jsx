import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { artistsAPI } from '../../services/api'
import { Card, Input, Badge } from '../../components/ui'
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/solid'

export default function Artists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const response = await artistsAPI.getArtists()
      setArtists(response.data.results || response.data || [])
    } catch (error) {
      console.error('Failed to fetch artists')
    } finally {
      setLoading(false)
    }
  }

  const filtered = artists.filter(a => 
    a.display_name.toLowerCase().includes(search.toLowerCase()) ||
    a.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">Browse Artists</h1>
        <p className="text-morning-gray mt-1">Find talented artists for your project</p>
      </div>

      <div className="relative">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-morning-gray" />
        <input
          type="text"
          placeholder="Search artists..."
          className="input pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((artist) => (
            <Link key={artist.id} to={`/artists/${artist.id}`}>
              <Card hover className="h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary-600">
                      {artist.display_name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-morning-darker">{artist.display_name}</h3>
                    <p className="text-sm text-morning-gray">{artist.specialty}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <StarIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium">{artist.rating || '0.0'}</span>
                  <span className="text-sm text-morning-gray">({artist.total_reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary-600">
                    ${artist.minimum_price}+
                  </span>
                  {artist.is_accepting_commissions ? (
                    <Badge variant="success">Available</Badge>
                  ) : (
                    <Badge variant="gray">Busy</Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
