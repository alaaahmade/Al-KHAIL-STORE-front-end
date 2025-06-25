// @mui
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
// types
//
import SearchNotFound from 'src/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: any[];
  onClickResult: (contact: any) => void;
};

export default function ChatNavSearchResults({ query, results, onClickResult }: Props) {
  const totalResults = results.length;

  const notFound = !totalResults && !!query;

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          px: 2.5,
          mb: 2,
        }}
      >
        Contacts ({totalResults})
      </Typography>

      {notFound ? (
        <SearchNotFound
          query={query}
          sx={{
            p: 3,
            mx: 'auto',
            width: `calc(100% - 40px)`,
            bgcolor: 'background.neutral',
          }}
        />
      ) : (
        <>
          {results.map((result) => {
            const isSeller = Array.isArray(result.roles) && result.roles.some((role: any) =>
              (typeof role === 'string' ? role.toUpperCase() : role.name?.toUpperCase()) === 'SELLER'
            );
            return (
              <ListItemButton
                key={result.id}
                onClick={() => onClickResult(result)}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  typography: 'subtitle2',
                }}
              >
                <Avatar
                  alt={isSeller ? result.seller.store.name : result.name}
                  src={isSeller ? result.seller.store.logo : result.photo}
                  sx={{ mr: 2 }}
                />
                {isSeller
                  ? result.seller.store.name
                  : result.firstName + ' ' + result.lastName}
              </ListItemButton>
            );
          })}
        </>
      )}
    </>
  );
}
