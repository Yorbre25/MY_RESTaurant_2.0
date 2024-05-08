interface AppError {
    code: number;
    message: string;
}

export function handleLogInError(error: any) : AppError {
  if (error.code == "auth/invalid-credential") {
    return {code: 401, message: "Invalid credentials"};
  } else if (error.code == "auth/invalid-email") {
    return {code: 400, message: "Invalid email"};
  }
  return {code: 500, message: "Internal server error"};
}

export function handleSignUpError(error: any) : AppError {
  if (error.code == "auth/email-already-in-use") {
    return {code: 409, message: "Email already in use"};
  } else if (error.code == "auth/missing-password") {
    return {code: 400, message: "Missing password"};
  } else if (error.code == "auth/missing-email") {
    return {code: 400, message: "Missing email"};
  } else if (error.code == "auth/weak-password") {
    return {code: 400, message: "Weak password"};
  }
  return {code: 500, message: "Internal server error"};
}

export function handleResetPasswordError(error: any) : AppError {
  if (error.code == "auth/invalid-email") {
    return {code: 400, message: "Invalid email"};
  } else if (error.code == "auth/missing-email") {
    return {code: 400, message: "Missing email"};
  }
  return {code: 500, message: "Internal server error"};
}

export function handlePromoteToAdminError(error: any) : AppError {
  if (error.message == "User not found") {
    return {code: 404, message: "User not found"};
  }
  return {code: 500, message: "Internal server error"};
}
