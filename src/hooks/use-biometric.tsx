
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Simulated biometric authentication for demo purposes
export function useBiometricAuth() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for biometric support
  useEffect(() => {
    // In a real app, this would check for actual biometric capabilities
    // Here we simulate support on modern browsers
    const checkSupport = async () => {
      try {
        // Check if this is a secure context
        if (window.isSecureContext) {
          // Check for credential API support (rough proxy for biometric capability)
          if (window.PublicKeyCredential) {
            setIsSupported(true);
          }
        }
      } catch (error) {
        console.error("Biometric check error:", error);
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  // Simulate authentication
  const authenticate = async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error("Biometric authentication is not supported on this device");
      return false;
    }

    try {
      // Simulate biometric verification
      toast.info("Authenticating with biometrics...");
      
      // Simulate the process with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success - in a real app this would be the result of actual biometric verification
      setIsAuthenticated(true);
      toast.success("Biometric authentication successful");
      return true;
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Biometric authentication failed");
      return false;
    }
  };
  
  // Simulated logout
  const logout = () => {
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  return {
    isSupported,
    isAuthenticated,
    authenticate,
    logout
  };
}
