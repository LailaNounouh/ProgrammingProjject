import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import './BedrijfDetail.css';

const baseUrl = 'http://10.2.160.211:3000/api'; 

export default function BedrijfDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { gebruiker } = useAuth();
  const [bedrijf, setBedrijf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fout, setFout] = useState('');
  const [slotState, setSlotState] = useState({
    loading: false,
    slots: [],
    error: '',
    msg: '',
    hasExisting: false,
    existingSlot: ''
  });

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

  // Haal bestaande afspraak van deze student met dit bedrijf
  useEffect(() => {
    async function checkExisting() {
      if (!gebruiker) return;
      try {
        const r = await fetch(`${baseUrl}/afspraken/student/${gebruiker.student_id || gebruiker.id}`, { credentials: 'include' });
        if (!r.ok) return;
        const afspraken = await r.json();
        const found = afspraken.find(a => (a.bedrijfsnaam_id === id || a.bedrijf_id === Number(id) || a.bedrijf_id === id) && a.datum === '2026-03-13');
        // fallback: vergelijk bedrijfsnaam als id ontbreekt
        const found2 = found || afspraken.find(a => a.bedrijfsnaam === bedrijf?.naam && a.datum === '2026-03-13');
        if (found2) {
          setSlotState(s => ({ ...s, hasExisting: true, existingSlot: found2.tijdslot }));
        }
      } catch (_) {}
    }
    checkExisting();
  }, [gebruiker, id, bedrijf]);

  async function laadSlotsSnel() {
    setSlotState(s => ({ ...s, loading: true, error: '', msg: '' }));
    try {
      const r = await fetch(`${baseUrl}/afspraken/beschikbaar/${id}`, { credentials: 'include' });
      if (!r.ok) throw new Error('Tijdsloten laden mislukt');
      const d = await r.json();
      const available = d.beschikbaar || [];
      if (!available.length) {
        setSlotState(s => ({ ...s, loading: false, error: 'Geen vrije tijdsloten' }));
        return;
      }
      // Boek onmiddellijk eerste vrije
      await boekSnel(available[0], available);
    } catch (e) {
      setSlotState(s => ({ ...s, loading: false, error: e.message }));
    }
  }

  async function boekSnel(tijdslot, currentSlots) {
    if (!gebruiker) return;
    try {
      const r = await fetch(`${baseUrl}/afspraken/nieuw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          student_id: gebruiker.student_id || gebruiker.id,
          bedrijf_id: id,
          tijdslot,
          datum: '2026-03-13'
        })
      });
      const resp = await r.json();
      if (!r.ok) throw new Error(resp.error || 'Aanmaken mislukt');
      setSlotState(s => ({
        ...s,
        loading: false,
        msg: `Afspraak aangevraagd (${tijdslot})`,
        hasExisting: true,
        existingSlot: tijdslot,
        slots: (currentSlots || []).filter(t => t !== tijdslot)
      }));
    } catch (e) {
      setSlotState(s => ({ ...s, loading: false, error: e.message }));
    }
  }

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

      <section className="bedrijfdetail__section">
        <h3 className="bedrijfdetail__sectionTitle">Afspraak</h3>
        {!gebruiker && <p className="bedrijfdetail__empty">Log in als student om een afspraak te maken.</p>}

        {gebruiker && (
          <>
            <button
              className="bedrijfdetail__back"
              style={{ background: '#0d66d0', color: '#fff', borderColor: '#0d66d0', minWidth: '150px' }}
              disabled={slotState.loading || slotState.hasExisting}
              onClick={laadSlotsSnel}
            >
              {slotState.loading ? 'Bezig...' : 'Snel afspraak'}
            </button>

            {slotState.hasExisting && (
              <p style={{ fontSize: '.7rem', marginTop: '.45rem', color: '#b55600' }}>
                Je hebt al een afspraak{slotState.existingSlot && ` om ${slotState.existingSlot}`} op dit tijdslot.
              </p>
            )}

            {slotState.error && (
              <p style={{ fontSize: '.7rem', marginTop: '.5rem', color: '#b91c1c' }}>{slotState.error}</p>
            )}
            {slotState.msg && (
              <p style={{ fontSize: '.7rem', marginTop: '.5rem', color: '#1b7a38' }}>{slotState.msg}</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}