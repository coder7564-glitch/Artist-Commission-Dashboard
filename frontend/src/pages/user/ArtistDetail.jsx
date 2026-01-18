import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { artistsAPI } from '../../services/api'
import { Card, CardTitle, Button, Badge } from '../../components/ui'
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/solid'

export default function ArtistDetail() {
  const { id } = useParams()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await artistsAPI.getArtist(id)
        setArtist(response.data)
      } catch (error) {
        console.error('Failed to fetch artist')
      } finally {
        setLoading(false)
      }
    }
    fetchArtist()
  }, [id])

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
  }

  if (!artist) {
    return <Card><p className="text-center py-8 text-morning-gray">Artist not found</p></Card>
  }

  return (
    <div className="space-y-6">
      <Link to="/artists" className="inline-flex items-center gap-2 text-morning-gray hover:text-morning-dark">
        <ArrowLeftIcon className="w-4 h-4" /> Back to Artists
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">{artist.display_name[0]}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-morning-darker">{artist.display_name}</h1>
                <p className="text-morning-gray">{artist.specialty}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StarIcon className="w-5 h-5 text-amber-400" />
                  <span className="font-medium">{artist.rating || '0.0'}</span>
                  <span className="text-morning-gray">({artist.total_reviews} reviews)</span>
                </div>
              </div>
            </div>
            {artist.description && <p className="mt-4 text-morning-dark">{artist.description}</p>}
          </Card>

          {artist.portfolio_items?.length > 0 && (
            <Card>
              <CardTitle>Portfolio</CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {artist.portfolio_items.map((item) => (
                  <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-morning-soft">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardTitle>Commission Info</CardTitle>
            <dl className="mt-4 space-y-3">
              <div className="flex justify-between">
                <dt className="text-morning-gray">Starting Price</dt>
                <dd className="font-semibold">${artist.minimum_price}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-morning-gray">Turnaround</dt>
                <dd>{artist.turnaround_days} days</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-morning-gray">Status</dt>
                <dd>{artist.is_accepting_commissions ? <Badge variant="success">Available</Badge> : <Badge variant="gray">Busy</Badge>}</dd>
              </div>
            </dl>
            <Link to={`/commissions/new?artist=${artist.id}`} className="block mt-6">
              <Button className="w-full" disabled={!artist.is_accepting_commissions}>
                Request Commission
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
