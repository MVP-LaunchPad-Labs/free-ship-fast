import axios, { type AxiosResponse, type AxiosError } from "axios";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import config from "@/config";


// HTTP status codes
const HTTP_STATUS = {
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
} as const;

// Error messages
const ERROR_MESSAGES = {
	LOGIN_REQUIRED: "Please login",
	PLAN_REQUIRED: "Pick a plan to use this feature",
	GENERIC_ERROR: "Something went wrong...",
} as const;

/**
 * Extracts error message from various error formats
 */
const extractErrorMessage = (error: AxiosError): string => {
	const responseError = error.response?.data as { error?: string } | undefined;
	return responseError?.error || error.message || error.toString();
};

/**
 * Handles authentication errors by showing toast and redirecting
 */
const handleAuthError = (): void => {
	toast.error(ERROR_MESSAGES.LOGIN_REQUIRED);
	redirect(config.auth.loginUrl);
};

/**
 * Handles authorization errors
 */
const handleAuthorizationError = (): string => {
	return ERROR_MESSAGES.PLAN_REQUIRED;
};

/**
 * Processes API errors and returns appropriate message
 */
const processError = (error: AxiosError): string => {
	const status = error.response?.status;

	switch (status) {
		case HTTP_STATUS.UNAUTHORIZED:
			handleAuthError();
			return ERROR_MESSAGES.LOGIN_REQUIRED;
		case HTTP_STATUS.FORBIDDEN:
			return handleAuthorizationError();
		default:
			return extractErrorMessage(error);
	}
};

/**
 * API client for internal API calls
 * Handles authentication, authorization, and error display automatically
 */
const apiClient = axios.create({
	baseURL: "/api",
});

apiClient.interceptors.response.use(
	(response: AxiosResponse) => response.data,
	(error: AxiosError) => {
		const message = processError(error);
		
		// Ensure error has proper message format
		const formattedMessage = typeof message === "string" ? message : JSON.stringify(message);
		error.message = formattedMessage;

		console.error("API Error:", formattedMessage);

		// Display error to user
		toast.error(formattedMessage || ERROR_MESSAGES.GENERIC_ERROR);

		return Promise.reject(error);
	}
);

export default apiClient;
