import { WordPressService } from '../services/WordPressService';

export const useWordPress = () => {
    const config = useRuntimeConfig();
    const wordpressUrl = config.public.wordpressUrl as string;

    const service = new WordPressService(wordpressUrl);

    return {
        service
    };
};
