import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setUrl } from '@/store/clientSlice';
import { ur } from 'zod/locales';

interface UrlInputProps {
  url: string;
  onChange: (url: string) => void;
}

export function UrlInput() {
  const dispatch = useDispatch();
  const url = useSelector((state: RootState) => state.client.url);
  console.log(url);
  return (
    <input
      type="text"
      className="flex-7 input input-bordered w-full"
      onChange={(e) => dispatch(setUrl(e.target.value))}
      value={url}
      placeholder="Enter URL"
    />
  );
}
