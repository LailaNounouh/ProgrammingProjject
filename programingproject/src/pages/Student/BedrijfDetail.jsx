import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BedrijfDetail.css';

const baseUrl = 'http://10.2.160.211:3000/api'; // zelfde baseUrl als elders

export default function BedrijfDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bedrijf, setBedrijf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fout, setFout] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setFout('');
      try {
        let res = await fetch(`${baseUrl}/bedrijfprofiel/${id}`);
        if (!res.ok) {

          res = await fetch(`${baseUrl}/bedrijvenmodule/${id}`);
        }
        if (!res.ok) {
          throw new Error(`Kon bedrijfsgegevens niet laden (status ${res.status})`);
        }
        const data = await res.json();
        setBedrijf(data);
      } catch (e) {
        setFout(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="bedrijfdetail__status">Bezig met laden...</div>;
  if (fout) return <div className="bedrijfdetail__status bedrijfdetail__status--error">Fout: {fout}</div>;
  if (!bedrijf) return <div className="bedrijfdetail__status">Bedrijf niet gevonden.</div>;

  const doelgroep = bedrijf.doelgroep_opleiding
    ? bedrijf.doelgroep_opleiding.split(',').map(s => s.trim()).filter(Boolean)
    : [];
  const aanbiedingen = bedrijf.aanbiedingen
    ? bedrijf.aanbiedingen.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="bedrijfdetail">
      <button onClick={() => navigate(-1)} className="bedrijfdetail__back">
        ← Terug
      </button>
      <h1 className="bedrijfdetail__title">{bedrijf.naam}</h1>
      {bedrijf.logo_url && (
        <img
          className="bedrijfdetail__logo"
          src={bedrijf.logo_url.startsWith('http') ? bedrijf.logo_url : `${baseUrl.replace('/api','')}/${bedrijf.logo_url}`}
          alt="Logo"
        />
      )}

      <section className="bedrijfdetail__section">
        <h3 className="bedrijfdetail__sectionTitle">Contact</h3>
        <ul className="bedrijfdetail__list">
          <li><strong>Email:</strong> {bedrijf.email || '—'}</li>
          <li><strong>Telefoon:</strong> {bedrijf.telefoonnummer || '—'}</li>
          <li><strong>Adres:</strong> {[bedrijf.straat, bedrijf.nummer, bedrijf.postcode, bedrijf.gemeente].filter(Boolean).join(' ') || '—'}</li>
          {bedrijf.website_of_linkedin && (
            <li>
              <strong>Website / LinkedIn:</strong>{' '}
              <a href={bedrijf.website_of_linkedin} target="_blank" rel="noreferrer" className="bedrijfdetail__link">
                {bedrijf.website_of_linkedin}
              </a>
            </li>
          )}
          {bedrijf.sector_naam && <li><strong>Sector:</strong> {bedrijf.sector_naam}</li>}
        </ul>
      </section>

      <section className="bedrijfdetail__section">
        <h3 className="bedrijfdetail__sectionTitle">Doelgroep Opleidingen</h3>
        {doelgroep.length === 0 ? <p className="bedrijfdetail__empty">Geen specifieke opleidingen vermeld.</p> : (
          <ul className="bedrijfdetail__tags">
            {doelgroep.map(d => <li key={d} className="bedrijfdetail__tag">{d}</li>)}
          </ul>
        )}
      </section>

      <section className="bedrijfdetail__section">
        <h3 className="bedrijfdetail__sectionTitle">Aanbiedingen</h3>
        {aanbiedingen.length === 0 ? <p className="bedrijfdetail__empty">Geen aanbiedingen vermeld.</p> : (
          <ul className="bedrijfdetail__tags">
            {aanbiedingen.map(a => <li key={a} className="bedrijfdetail__tag">{a}</li>)}
          </ul>
        )}
      </section>

      <section className="bedrijfdetail__section">
        <h3 className="bedrijfdetail__sectionTitle">Speeddate</h3>
        <p className="bedrijfdetail__statusText">
          {bedrijf.speeddates ? 'Speeddate mogelijk' : 'Geen speeddate beschikbaar'}
        </p>
      </section>
    </div>
  );
}