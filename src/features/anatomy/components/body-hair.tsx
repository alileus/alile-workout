import type { View } from '../model';
import { femalePath, type BodyVariant } from '../body-variants';

// Keep the ponytail behind the body so the neck and shoulders remain visible.
export function HairBehind({ bodyVariant }: { bodyVariant: BodyVariant }) {
  if (bodyVariant === 'male') return null;
  return (
    <g aria-hidden="true" pointerEvents="none" fill="#292929" stroke="#555" strokeWidth="0.8">
      <path
        d={femalePath(
          'M220 30 Q241 23 247 42 Q250 61 241 78 Q236 96 249 112 Q230 106 227 88 Q224 72 232 52 Q235 42 221 42 Z',
        )}
      />
      <path d={femalePath('M232 34 Q245 47 237 66 Q229 89 241 103')} fill="none" stroke="#464646" />
      <path d={femalePath('M220 30 L228 28 L231 41 L222 44 Z')} fill="#606060" />
    </g>
  );
}

export function BodyHair({ bodyVariant, view }: { bodyVariant: BodyVariant; view: View }) {
  const female = bodyVariant === 'female';
  const outline = female
    ? view === 'front'
      ? 'M173 62 Q166 43 173 29 Q180 15 197 15 Q221 14 228 33 Q233 45 226 63 L219 51 L217 37 Q200 47 183 40 L179 51 Z'
      : 'M173 59 Q166 42 175 28 Q183 15 199 15 Q223 16 229 36 Q233 49 226 63 L218 78 Q200 87 182 77 Z'
    : view === 'front'
      ? 'M174 53 L173 43 Q174 21 198 20 Q222 20 226 42 L226 53 L221 46 L218 39 Q200 35 181 40 L179 47 Z'
      : 'M173 48 Q174 21 198 20 Q223 20 227 48 L224 65 L218 77 Q200 85 182 77 L176 65 Z';
  const strands = female
    ? view === 'front'
      ? 'M181 32 Q194 23 219 29 M179 36 Q198 32 220 32 M225 42 L224 51'
      : 'M179 43 Q193 30 220 32 M180 58 Q202 43 223 36 M191 74 Q216 59 225 43'
    : view === 'front'
      ? 'M184 31 L185 31 M191 27 L192 27 M200 26 L201 26 M209 28 L210 28 M216 32 L217 32 M179 39 L180 39 M222 43 L223 43'
      : 'M183 32 L184 32 M194 27 L195 27 M207 29 L208 29 M217 36 L218 36 M180 44 L181 44 M192 40 L193 40 M204 43 L205 43 M218 49 L219 49 M183 57 L184 57 M195 54 L196 54 M207 57 L208 57 M192 68 L193 68 M205 71 L206 71';
  return (
    <g aria-hidden="true" pointerEvents="none">
      <path
        d={female ? femalePath(outline) : outline}
        fill={female ? '#292929' : '#343434'}
        stroke="#5c5c5c"
        strokeWidth="0.8"
      />
      <path
        d={female ? femalePath(strands) : strands}
        fill="none"
        stroke="#494949"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </g>
  );
}
