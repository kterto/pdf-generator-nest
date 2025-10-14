import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "./jwt-auth-guard";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @Post("signin")
  async signin(@Request() req) {
    return this.authService.login({
      email: req.body.email.toString(),
      password: req.body.password,
    });
  }

  @ApiOperation({ summary: "User registration" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @Post("signup")
  async signup(@Body() createUserDto: any) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: "User logout" })
  @ApiResponse({ status: 200, description: "Logout successful" })
  @Post("signout")
  async signout() {
    // In a real app, you'd invalidate the token
    return { message: "Logged out successfully" };
  }

  @ApiOperation({ summary: "Signed in User information" })
  @ApiResponse({ status: 200, description: "User data" })
  @UseGuards(JwtAuthGuard)
  @Get("self")
  async self(@Request() req) {
    return this.authService.userData(req.user.email);
  }
}
