"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Function to sanitize input by trimming whitespace, removing slashes, and escaping HTML entities
const sanitizeInput = (input: string) => {
  const trimmedInput = input.trim();
  const escapedInput = trimmedInput
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\\/g, ""); // Removing backslashes
  return escapedInput;
};

export default function Register() {
  const router = useRouter();

  // State variables for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState(""); // Optional Contact Field

  // Declaring state variables for error messages
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [contactError, setContactError] = useState(""); // Error for optional contact field
  // Error & success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear all previous error messages
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setContactError("");

    let isValid = true;

    // Sanitized inputs for error checking
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);
    const sanitizedContact = sanitizeInput(contact);

    // FIRST NAME VALIDATIONS

    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(sanitizedFirstName)) {
      setFirstNameError("First name should contain only letters and spaces.");
      isValid = false;
    }

    if (sanitizedFirstName.length > 25) {
      setFirstNameError("First name cannot be longer than 25 characters.");
      isValid = false;
    }

    // LAST NAME VALIDATIONS

    if (!namePattern.test(sanitizedLastName)) {
      setLastNameError("Last name should contain only letters and spaces.");
      isValid = false;
    }

    if (sanitizedLastName.length > 50) {
      setLastNameError("Last name cannot be longer than 50 characters.");
      isValid = false;
    }

    // EMAIL VALIDATIONS

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(sanitizedEmail)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }
    if (sanitizedEmail.length > 50) {
      setEmailError("Email address cannot be longer than 50 characters.");
      isValid = false;
    }

    // PASSWORD VALIDATIONS

    if (sanitizedPassword.length < 6 || sanitizedPassword.length > 50) {
      setPasswordError("Password must be between 6 and 50 characters long.");
      isValid = false;
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    // CONTACT VALIDATIONS (Optional)
    if (sanitizedContact) {
      const contactPattern = /^[0-9]+$/; // Only digits allowed
      if (!contactPattern.test(sanitizedContact)) {
        setContactError("Contact number should contain only digits.");
        isValid = false;
      }

      if (sanitizedContact.length < 10 || sanitizedContact.length > 15) {
        setContactError("Contact number should be between 10 and 15 digits.");
        isValid = false;
      }
    }

    if (isValid) {
      alert("Validation passed! Now you can proceed with registration.");
      const sanitizedData = {
        firstName: sanitizeInput(firstName),
        lastName: sanitizeInput(lastName),
        email: sanitizeInput(email),
        password: sanitizeInput(password),
        contact: sanitizeInput(contact),
      };
      console.log(" Register form submitted"); // Debugging log
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitizedData),
        });

        const data = await res.json();

        if (!res.ok) {
          console.log(" Registration failed:", data.message); // Debugging log
          setError(data.message);
        } else {
          console.log(
            " Registration successful! Redirecting to /verify-email..."
          ); // Debugging log
          router.push("/verify-email"); //  Redirecting user to /verify-email
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="screenMiddleDiv">
      <div className="formDiv">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-center text-2xl font-bold">Create Account</h2>

          {/* First Name Input */}
          <div>
            <label htmlFor="firstName" className="formLabel">
              First Name
            </label>
            {firstNameError && (
              <p className="text-red-500 text-xs">{firstNameError}</p>
            )}
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name Input */}
          <div>
            <label htmlFor="lastName" className="formLabel">
              Last Name
            </label>
            {lastNameError && (
              <p className="text-red-500 text-xs">{lastNameError}</p>
            )}
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="my-6">
            <label htmlFor="email" className="formLabel">
              Email Address
            </label>
            {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="my-6">
            <label htmlFor="password" className="formLabel">
              Password
            </label>
            {passwordError && (
              <p className="text-red-500 text-xs">{passwordError}</p>
            )}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="my-6">
            <label htmlFor="confirmPassword" className="formLabel">
              Confirm Password
            </label>
            {confirmPasswordError && (
              <p className="text-red-500 text-xs">{confirmPasswordError}</p>
            )}
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Optional Contact Input */}
          <div className="my-6">
            <label htmlFor="contact" className="formLabel">
              Contact (Optional)
            </label>
            {contactError && (
              <p className="text-red-500 text-xs">{contactError}</p>
            )}
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <button type="submit" className="formButton">
            Register
          </button>

          <div className="text-center mt-4">
            Already have an account?
            <a href="#">
              <button className="buttonTiny">Login</button>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
