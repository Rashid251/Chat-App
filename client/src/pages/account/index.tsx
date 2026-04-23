import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState } from "react";
import AppWrapper from "@/components/app-wrapper";
import AvatarWithBadge from "@/components/avatar-with-badge";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AccountPage = () => {
  const { user, updateProfile, isUpdatingProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, avatar });
  };

  return (
    <AppWrapper>
      <div className="flex-1 p-8 h-full bg-background overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and profile information.
            </p>
          </div>

          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your name and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-4">
                  <div className="relative group">
                    <AvatarWithBadge
                      name={user?.name || "User"}
                      src={avatar || user?.avatar || ""}
                      className="size-24 text-3xl border-4 border-background shadow-xl"
                      isOnline={true}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || isUpdatingProfile}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      ) : (
                        <Camera className="h-8 w-8 text-white" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-semibold text-lg">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      Click the avatar to upload a gallery picture or enter a URL below.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-background/50 h-11"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className="bg-background/50 h-11"
                  />
                  <p className="text-[11px] text-muted-foreground px-1">
                    Tip: You can paste an image URL or upload one from your gallery.
                  </p>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto px-10 h-11"
                    disabled={isUpdatingProfile || isUploading}
                  >
                    {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Your registration information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1">
                <Label className="text-xs uppercase text-muted-foreground tracking-wider font-bold">Email Address</Label>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs uppercase text-muted-foreground tracking-wider font-bold">Member Since</Label>
                <p className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "Unknown"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppWrapper>
  );
};

export default AccountPage;
