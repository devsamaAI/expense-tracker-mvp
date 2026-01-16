import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAppSettings } from '../hooks/useAppSettings';
import { Select } from './ui/select';
import { Shield, Key } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
    const { settings, updateSettings } = useAppSettings();
    const [apiKey, setApiKey] = React.useState(settings?.llmApiKey || '');
    const [saved, setSaved] = React.useState(false);

    React.useEffect(() => {
        if (settings?.llmApiKey) {
            setApiKey(settings.llmApiKey);
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings({ llmApiKey: apiKey });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!settings) return <div>Loading...</div>;

    return (
        <Card className="mb-6 border-green-500/30 bg-green-950/10">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Groq API Key (for AI categorization)
                    </label>
                    <div className="flex gap-2">
                        <Input
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="gsk_..."
                            className="font-mono text-sm"
                        />
                        <Button onClick={handleSave} variant={saved ? "default" : "outline"}>
                            {saved ? "Saved!" : "Save"}
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-green-500" />
                            <strong>Secure:</strong> Your API key is stored only in your browser's local storage.
                        </p>
                        <p>Get a free key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="underline text-blue-400 hover:text-blue-300">console.groq.com</a></p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Select
                        value={settings.currency}
                        onChange={e => updateSettings({ currency: e.target.value as any })}
                    >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};
