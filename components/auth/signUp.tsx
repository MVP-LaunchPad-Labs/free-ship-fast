import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OAuthButton from "./oauthButton";
import MagicLink from "./MagicLink";

export default function SignUp() {
	return (
		<Card className="w-full max-w-sm mx-auto">
			<CardHeader className="text-center">
				<CardTitle className="text-xl ">Create Account</CardTitle>
				<p className="text-sm text-muted-foreground mt-2">
					Join us today! Create your account to get started
				</p>
			</CardHeader>
			<CardContent className=" flex flex-col gap-4">
				<OAuthButton provider="google">Continue with Google</OAuthButton>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground border rounded-md py-0.5">
							or
						</span>
					</div>
				</div>

				<MagicLink />

				<div className="text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<a href="/sign-in" className="text-primary hover:underline">
						Sign in
					</a>
				</div>
			</CardContent>
		</Card>
	);
}
