import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Users, Target, Lightbulb, HeartHandshake } from "lucide-react";

type TeamMember = {
  name: string;
  role: string;
  image: string;
  description: string;
};

const teamMembers: TeamMember[] = [
  {
    name: "Alex Johnson",
    role: "CEO & Founder",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "10+ years of experience in technology and business development."
  },
  {
    name: "Sarah Williams",
    role: "CTO",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Expert in software architecture and team leadership."
  },
  {
    name: "Michael Chen",
    role: "Lead Developer",
    image: "https://randomuser.me/api/portraits/men/29.jpg",
    description: "Full-stack developer with a passion for clean code."
  },
  {
    name: "Emily Rodriguez",
    role: "UX/UI Designer",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    description: "Creating beautiful and intuitive user experiences."
  }
];

const stats = [
  { label: 'Happy Clients', value: '500+' },
  { label: 'Projects Completed', value: '1200+' },
  { label: 'Team Members', value: '50+' },
  { label: 'Years in Business', value: '8' },
];

const values = [
  {
    name: 'Innovation',
    description: 'We embrace creativity and explore new ideas to drive progress.',
    icon: Lightbulb,
  },
  {
    name: 'Excellence',
    description: 'We strive for the highest standards in everything we do.',
    icon: Target,
  },
  {
    name: 'Collaboration',
    description: 'We believe in the power of teamwork and shared success.',
    icon: Users,
  },
  {
    name: 'Integrity',
    description: 'We conduct our business with honesty and transparency.',
    icon: HeartHandshake,
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-sm font-medium">About Us</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              We're building the future of digital experiences
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering businesses with innovative solutions that drive growth and create lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg mb-6">
                To empower businesses and individuals through innovative technology solutions that simplify 
                complex problems and create meaningful connections.
              </p>
              <p className="text-muted-foreground mb-8">
                Founded in 2015, our company has grown from a small startup to a leading provider of 
                digital solutions. We're committed to delivering exceptional value to our clients 
                through cutting-edge technology and unparalleled service.
              </p>
              <Button size="lg">Learn More About Our Work</Button>
            </div>
            <div className="bg-muted rounded-xl aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🚀</div>
                <p className="text-muted-foreground">Our journey continues to evolve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Core Values</h2>
            <p className="text-muted-foreground">
              These principles guide everything we do and define who we are as a company.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{value.name}</h3>
                  </div>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">
              Passionate individuals working together to create something amazing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                    <AvatarFallback className="text-2xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white">{member.description}</p>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to work with us?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's create something amazing together. Our team is ready to help you bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Email Us</h3>
              <p className="text-muted-foreground">hello@example.com</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Call Us</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Visit Us</h3>
              <p className="text-muted-foreground">123 Business Ave, San Francisco, CA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
