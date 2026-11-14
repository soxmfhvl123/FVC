
import type { Outbreak, Strain } from '@/lib/content';
import { catalogNo, formatLabel, isolatedLabel, ph, shortDate } from '@/lib/format';
import { Clock } from '@/components/fvc/Clock';
import { Germ } from '@/components/fvc/Germ';
import { HeroGerm } from '@/components/fvc/HeroGerm';
import { LiveWordmark } from '@/components/fvc/LiveWordmark';
import { BitNoiseOval, Crosshair, DishLogo, Grain } from '@/components/fvc/Marks';
import s from './home.module.css';

/** Section 1 — Golova / Into the Noise hero. */
export function Hero({ strain, outbreak }: { strain: Strain; outbreak?: Outbreak }) {
  const no = catalogNo(strain.id);
  const artist = ph(strain.carrier, 'Artist');
  const date = outbreak?.date ? isolatedLabel(outbreak.date) : '[Date]';
  const facts = [ph(strain.strainType, 'Genre'), ...strain.formats.map(formatLabel), 'Seoul'].join(' ▮ ').toUpperCase();
  return (
    <header className={s.hero}>
      <h1 className="sr-only">FVC RECORDS — Fat Virus Carrier</h1>

      <HeroGerm seed={strain.seed} spot={strain.spot} eyes={strain.eyes} className={s.heroGerm} />
      <Germ seed={150} N={60} two={false} lumps={4} dust={0.004} className={`${s.heroSat} fvc-hide-sm`} />

      <div className={`${s.heroStack} fvc-hide-sm`} aria-hidden="true">
        <div className={s.row}>
          <span className={s.heroBarSm} style={{ letterSpacing: '0.4em' }}>
            SPECIMEN {strain.id}
          </span>
          <Crosshair size={18} />
        </div>
        <div className={s.row}>
          <BitNoiseOval id="hov" w={96} h={27} />
          <span className={s.heroBarSm} style={{ fontSize: 18, padding: '0 8px' }}>
            {artist.toUpperCase()} {artist.toUpperCase()}
          </span>
        </div>
        <span className={s.heroBarSm}>
          {outbreak ? `LOW-END SOUNDSYSTEM ▮ OUTBREAK NIGHT ▮ ${date.toUpperCase()}` : facts}
        </span>
      </div>

      <Crosshair className={s.abs} style={{ left: '47%', top: 120 }} />
      <Crosshair className={s.abs} style={{ right: 120, bottom: 90 }} />

      <div className={s.heroTop}>
        <span>
          {strain.isolated ? `${shortDate(strain.isolated)} ` : ''}Strain·{no}
        </span>
        <Clock format="short" />
      </div>
      <div className={s.heroDish}>
        <DishLogo />
      </div>

      <div className={`${s.heroInfo} fvc-hide-sm`} style={{ left: '34%', top: 160 }}>
        (A) Strain:
        <br />
        {strain.id}
        <br />
        {artist}
      </div>
      {outbreak && (
        <div className={`${s.heroInfo} fvc-hide-sm`} style={{ left: '52%', top: 250, textAlign: 'right' }}>
          (B) Outbreak Night:
          <br />
          {date} {outbreak?.doors ?? '23:00'}
          <br />
          Location undisclosed
        </div>
      )}

      <LiveWordmark className={s.heroMark} letterStyle={{ width: 'min(300px, 24vw)', height: 'auto' }} />

      <div className={s.heroVert}>
        <span>Fat Virus Carrier</span>
        <span className="fvc-serif">Records</span>
      </div>
      <div className={s.heroAddr}>FVC Records&nbsp;&nbsp;&nbsp;fvc.ai.kr&nbsp;&nbsp;&nbsp;Seoul</div>
      <a href="#now-spreading" className={s.heroNow}>
        Now Spreading
      </a>

      <Grain opacity={0.2} />
    </header>
  );
}
