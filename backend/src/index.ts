import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
    console.log(`EduPayTrack backend is running on port ${env.PORT}`);
});