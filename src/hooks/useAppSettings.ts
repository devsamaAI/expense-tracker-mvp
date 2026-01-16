import { useState, useEffect } from 'react';
import type { AppSettings } from '../types';
import { StorageService } from '../services/storage';

export function useAppSettings() {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        const data = await StorageService.getSettings();
        setSettings(data);
        setLoading(false);
    };

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        const updated = await StorageService.updateSettings(newSettings);
        setSettings(updated);
        return updated;
    };

    return { settings, loading, updateSettings };
}
