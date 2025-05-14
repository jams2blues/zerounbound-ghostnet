/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/SearchBar.jsx
  Summary: Debounced search input for Explore page
*/

import React, { useState, useEffect } from 'react';
import PixelInput from './PixelInput';

export default function SearchBar({ onChange, delay = 300 }) {
  const [val, setVal] = useState('');

  useEffect(() => {
    const id = setTimeout(() => onChange(val.trim()), delay);
    return () => clearTimeout(id);
  }, [val]);

  return (
    <PixelInput
      placeholder="Search by name, symbol, KT1…"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      style={{ width: '100%', maxWidth: 400 }}
    />
  );
}

/* What changed & why
   • Stand-alone debounced input avoids re-renders while typing.
*/
