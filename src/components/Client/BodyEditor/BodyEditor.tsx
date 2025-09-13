import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setBody } from '@/store/clientSlice';

// interface BodyEditorProps {
//   requestBody: string;
//   onChange: (body: string) => void;
// }

export function BodyEditor() {
  const dispatch = useDispatch();
  const requestBody = useSelector((state: RootState) => state.client.body);

  return (
    <div>
      <span>Body</span>
      <textarea
        className="textarea textarea-bordered w-full mt-1"
        rows={6}
        placeholder="Enter JSON or text"
        value={requestBody}
        onChange={(e) => dispatch(setBody(e.target.value))}
      ></textarea>
    </div>
  );
}
