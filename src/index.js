import 'dotenv/config';

import server from './app';

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
