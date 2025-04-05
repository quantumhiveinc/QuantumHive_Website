'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react'; // Import icons
import { toast } from "sonner"; // Import toast
// Assuming PasswordInput is a custom component or use type="password"
// import { PasswordInput } from "@/components/ui/PasswordInput"; 

// TODO: Fetch initial settings values
// TODO: Implement actual API calls for save and test

interface UnsplashSettingsFormProps {
    initialSettings?: {
        accessKey?: string;
        secretKey?: string;
        appName?: string;
    };
}

export function UnsplashSettingsForm({ initialSettings = {} }: UnsplashSettingsFormProps) {
    const [accessKey, setAccessKey] = useState(initialSettings.accessKey || '');
    const [secretKey, setSecretKey] = useState(initialSettings.secretKey || '');
    const [appName, setAppName] = useState(initialSettings.appName || '');
    const [testStatus, setTestStatus] = useState<{ message: string; type: 'success' | 'error' | 'idle' }>({ message: '', type: 'idle' });
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [isAccessKeyVisible, setIsAccessKeyVisible] = useState(false);
    const [isSecretKeyVisible, setIsSecretKeyVisible] = useState(false);

    const handleTestConnection = async () => {
        setIsTesting(true);
        setTestStatus({ message: 'Testing...', type: 'idle' });
        try {
            const response = await fetch('/api/admin/settings/unsplash/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessKey, secretKey }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setTestStatus({ message: result.message || 'Connection successful!', type: 'success' });
            } else {
                setTestStatus({ message: `Error: ${result.error || 'Test failed'}`, type: 'error' });
            }
        } catch (error) {
            console.error("Failed to test connection:", error);
            setTestStatus({ message: 'Error: Could not reach server.', type: 'error' });
        } finally {
            setIsTesting(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        setTestStatus({ message: '', type: 'idle' }); // Clear test status on save
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: 'integrations', // Specify the category
                    unsplash_access_key: accessKey,
                    unsplash_secret_key: secretKey,
                    unsplash_app_name: appName,
                }),
            });

            if (response.ok) {
                toast.success('Settings saved successfully!');
            } else {
                const result = await response.json();
                console.error('Failed to save settings:', result.error);
                toast.error(`Failed to save settings: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error('An error occurred while saving settings.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="unsplash-access-key">Access Key</Label>
                <div className="relative">
                    <Input
                        id="unsplash-access-key"
                        type={isAccessKeyVisible ? "text" : "password"}
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        placeholder="Enter your Unsplash Access Key"
                        required
                        autoComplete="new-password" // Prevent browser autofill issues
                        className="pr-10" // Add padding for the icon
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                        onClick={() => setIsAccessKeyVisible(!isAccessKeyVisible)}
                        aria-label={isAccessKeyVisible ? "Hide access key" : "Show access key"}
                    >
                        {isAccessKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="unsplash-secret-key">Secret Key</Label>
                 <div className="relative">
                    <Input
                        id="unsplash-secret-key"
                        type={isSecretKeyVisible ? "text" : "password"}
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder="Enter your Unsplash Secret Key"
                        required
                        autoComplete="new-password" // Prevent browser autofill issues
                        className="pr-10" // Add padding for the icon
                    />
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                        onClick={() => setIsSecretKeyVisible(!isSecretKeyVisible)}
                        aria-label={isSecretKeyVisible ? "Hide secret key" : "Show secret key"}
                    >
                        {isSecretKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="unsplash-app-name">Application Name (Optional)</Label>
                <Input
                    id="unsplash-app-name"
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., My Awesome CMS"
                />
            </div>

            <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={handleTestConnection} disabled={isTesting || !accessKey || !secretKey}>
                        {isTesting ? 'Testing...' : 'Test Connection'}
                    </Button>
                    {testStatus.type !== 'idle' && (
                        <span className={`text-sm ${testStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {testStatus.message}
                        </span>
                    )}
                 </div>

                <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
            </div>
        </form>
    );
}