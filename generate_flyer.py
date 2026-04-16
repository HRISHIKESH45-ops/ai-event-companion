from PIL import Image, ImageDraw, ImageFont
import os

def create_flyer():
    # Create a canvas
    width, height = 800, 1000
    image = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)

    # Simple layout
    draw.rectangle([0, 0, width, 150], fill=(79, 70, 229)) # Header bg (indigo-600)
    
    # Texts
    # Title
    draw.text((width/2, 75), "GLOBAL AI SUMMIT 2026", fill=(255, 255, 255), anchor="mm", font_size=50)
    
    # Agenda Title
    draw.text((50, 200), "OFFICIAL AGENDA", fill=(51, 65, 85), font_size=35)
    
    agenda = [
        ("09:00 AM", "Opening Keynote: Scaling with Gemini"),
        ("10:30 AM", "Workshop: Multi-Modal Prompting"),
        ("12:00 PM", "Networking Lunch & Expo"),
        ("01:30 PM", "Panel: The Future of Agentic AI"),
        ("03:00 PM", "Hands-on: Building Custom GPTs"),
        ("04:30 PM", "Lightning Talks & Awards"),
        ("06:00 PM", "Closing Cocktails")
    ]
    
    y = 280
    for time, activity in agenda:
        draw.text((50, y), time, fill=(79, 70, 229), font_size=24) # indigo-600
        draw.text((200, y), activity, fill=(30, 41, 59), font_size=24) # slate-900
        y += 60
        
    # Footer
    draw.rectangle([0, 900, width, height], fill=(241, 245, 249)) # bg-slate-100
    draw.text((width/2, 950), "Location: Virtual & San Francisco | Hosted by Hack2Skill", fill=(71, 85, 105), anchor="mm", font_size=20)

    # Save
    output_path = "sample_hackathon_flyer.png"
    image.save(output_path)
    print(f"Flyer saved to {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_flyer()
