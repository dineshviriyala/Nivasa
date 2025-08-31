import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Shield,
  Wrench,
  Users,
  CheckCircle,
  ArrowRight,
  Plus,
  Github,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);

  const features = [
    {
      icon: Wrench,
      title: "Easy Ticket Management",
      description: "Report and track maintenance issues with just a few clicks",
    },
    {
      icon: Users,
      title: "Tenant Communication",
      description: "Streamlined communication between tenants and management",
    },
    {
      icon: Shield,
      title: "Admin Dashboard",
      description: "Comprehensive management tools for property administrators",
    },
    {
      icon: CheckCircle,
      title: "Quick Resolution",
      description: "Fast assignment and tracking of maintenance requests",
    },
  ];

  

  if (showLogin) {
    return (
      <LoginForm
        onBack={() => setShowLogin(false)}
        onSwitchToSignup={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Nivasa
                </span>
              </span>
            </div>
            <div className="flex space-x-4"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simplify Your
            <span className="text-blue-600 block">Apartment Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline maintenance requests, manage tenants, and keep your
            property running smoothly with our comprehensive apartment
            administration platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-3">
              <Link to="/register-apartment">
                Register New Apartment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-3"
            >
              <Link to="/resident-registration">Join as Resident</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowLogin(true)}
              className="text-lg px-8 py-3"
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Property
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From tenant requests to technician management, we've got you
              covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of property managers who have streamlined their
            operations with Nivasa.
          </p>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building2 className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">Nivasa</span>
          </div>
          <p className="text-center text-gray-400">
            Â© 2024 Nivasa. All rights reserved. Simplifying apartment
            management one property at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;