export const INITIAL_CLIENTS = [
  {
    id: 'cli-1',
    full_name: 'Jean Paul Nkurunziza',
    id_number: '1 1988 8 0039281 0 45',
    phone_number: '0788 554 433',
    items_taken: 'Charcoal Slim Fit Suit (38R)',
    return_due: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    status: 'active_rental',
    recorded_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'cli-2',
    full_name: 'Marie Claire Uwera',
    id_number: '1 1993 7 0048192 0 12',
    phone_number: '0785 221 990',
    items_taken: 'Onyx Double-Breasted Suit (44R)',
    return_due: new Date().toISOString().slice(0, 10),
    status: 'active_rental',
    recorded_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'cli-3',
    full_name: 'Patrick Kalisa',
    id_number: '1 1985 8 0019283 0 77',
    phone_number: '0722 889 001',
    items_taken: 'Midnight Navy 3-Piece (42R)',
    return_due: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    status: 'returned',
    recorded_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
]
