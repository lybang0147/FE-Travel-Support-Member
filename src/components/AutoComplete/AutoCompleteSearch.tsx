import React, { useState, useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import toast from 'react-hot-toast';

interface AutoCompleteSearchProps {
  value: string;
  onChange: (address: { address: string; longitude: number; latitude: number }) => void;
}

const AutoCompleteSearch: React.FC<AutoCompleteSearchProps> = ({ value, onChange }) => {
  const [stayAddress, setStayAddress] = useState({ address: '', longitude: 0, latitude: 0 });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    const address = place?.formatted_address ?? '';
    if (place?.geometry?.location)
    {
      const longitude = place?.geometry?.location.lng() || 0;
      const latitude = place?.geometry?.location.lat() || 0;
      setStayAddress({ address, longitude, latitude });
      onChange({ address, longitude, latitude });
    }
    else{
    toast.error("Địa điểm không hợp lệ");
    }
  };

  const options = {
    componentRestrictions: { country: 'vn' },
  };

  return (
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelect}
        options={options}
      >
        <input type="text" className="formControl" placeholder="Nhập địa chỉ khách sạn của bạn..." />
      </Autocomplete>
  );
};

export default AutoCompleteSearch;
