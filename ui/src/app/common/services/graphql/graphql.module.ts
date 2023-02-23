import { NgModule } from '@angular/core';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

const uri = 'https://classic.warcraftlogs.com/api/v2/client';

const authLink: ApolloLink = setContext((_, { headers }) => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ODAwMmM4ZS0wYjY0LTRjMTktYmM4MS0yYWExOWQ2OWRiZmUiLCJqdGkiOiIwOGRkOWM0MDg2MjliZjMzMzBmYWRkNzdiYjNmNDFhYjIwYTA3N2U2ODZiYWQwM2U3YWU4NWZlMWZhYjMwM2Q0NjQ3Y2EwNjAwOGFlYjVlMyIsImlhdCI6MTY3NzEyODkzMi45NDI5NTcsIm5iZiI6MTY3NzEyODkzMi45NDI5NjEsImV4cCI6MTcwODIzMjkzMi45MzYyOTUsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXVzZXItcHJvZmlsZSIsInZpZXctcHJpdmF0ZS1yZXBvcnRzIl19.qMgzc_FKyYcvYfQ84elA41Nc21bv5GlZASFWM2p_4fds4G5WzTsyRpnYDLqQZPmu_uRQrWu7qn1kwzSYKkB64HLTXIiQm5K7V42ANiT8h1177FNIpFA-02gjxt6GBZ83Jv_xST0-0_i1TIafVaEF6ykR5dlbnIMKU9ICTcd2cgJ4b5sM584VXfk5DzFXfYzhE2qNIYUvMyYJEZAgTpge3j04BiHPp_mAx2ttdcAma4ijMhjQHJ5mjXN5kGyyitb2gzdSL41h9RccCv7lcr0TaVBGJSrrXTqFOVkABkeoPquUtrixtmUzidEEwkocY5R3UhxbBlA_pn-l7AeT56fXpytL-7aoyNhwFfkWYGhHr8rQq9xbAID8drc2MK7O7ZqTLg4dyllWUikjc69F0HKwqZdqitMqF_LbhWEaoq0w08qSaXUERfZPj4sCVu0kAkTo3F_T7_6GMlQAwGOPtqqROc7bO6E6FwSCzCQ4suMHFul15oqueQNNgGgcmQvuohQd0g33O5vTHgEK8Xi4OhnZvz4GurNVgP4ibYtmB5huGILk96AJ22NDm0I2DkKPOGaLy8XqBLudWr07KKjOOWT4veeYdSCeTKlSaROtEskRvW1uLOmNNsgZpMf7AWBimNN-ouFmyv7vtVjcA6YjOpdZYwWX3NLU-ou_9W6lz94MZo8';
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  };
});

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: authLink.concat(httpLink.create({ uri })),
    cache: new InMemoryCache()
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
