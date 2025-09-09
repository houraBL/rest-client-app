type SearchInputProps = {
  text: string;
};

export const SearchInput = ({ text }: SearchInputProps) => {
  return (
    <div className="mt-4 mb-4">
      <div className="relative flex gap-2 items-center">
        <input
          type="search"
          placeholder={text}
          className="border px-3 py-2 rounded w-full font-thin text-xl"
        />
        <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xl font-thin cursor-pointer">
          Search
        </button>
      </div>
    </div>
  );
};
