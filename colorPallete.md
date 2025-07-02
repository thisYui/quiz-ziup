# Nebula Quiz Color Palette

## **Background Colors**

- **Main Background**: `#0D0D0D` (Obsidian Black) - Used for the entire app background.
- **Card Background**: `#1A1A1A` (Dark Charcoal) - Used for main question cards and result cards.
- **Secondary Background**: `#2A2A2A` (Medium Charcoal) - Used for question boxes, answer options, and input fields.

## **Text Colors**

- **Primary Text**: `#F5F5F5` (Ghost White) - Used for main headings, questions, and answer text.
- **Secondary Text**: `#CCCCCC` (Light Grey) - Used for subtitles, descriptions, and helper text.
- **Muted Text**: `#888888` (Medium Grey) - Used for placeholders and less important information.

## **Border Colors**

- **Primary Borders**: `#666666` (Dark Grey) - Used for input fields, answer options, and general borders.
- **Card Borders**: `#444444` (Darker Grey) - Used for main card containers and header/footer separators.
- **Hover Borders**: `#CCCCCC` (Light Grey) - Used when hovering over interactive elements.

## **Gradient Colors**

### **Primary Gradient (Purple to Pink)**

- **Start**: `#9333EA` (Vibrant Purple)
- **End**: `#DB2777` (Hot Pink)
- **Used for**: Submit buttons, "Try Again" button, quiz badges, main action buttons.

### **Secondary Gradient (Blue to Teal)**

- **Start**: `#2563EB` (Royal Blue)
- **End**: `#14B8A6` (Emerald Teal)
- **Used for**: Next button, selected answer states, progress indicators, score display.

## **Interactive States**

### **Selected/Active States**

- **Selected Answer Background**: `#2563EB/10` (Royal Blue with 10% opacity)
- **Selected Border**: `#2563EB` (Royal Blue) - 2px border for selected items.
- **Selected Shadow**: `shadow-[0_0_0_1px_#2563EB]` (Royal Blue glow)

### **Hover States**

- **Hover Background**: `#F5F5F5/5` (Ghost White with 5% opacity)
- **Hover Border**: `#CCCCCC` (Light Grey)
- **Button Hover Shadow**: `rgba(219,39,119,0.3)` (Hot Pink with transparency)

## **Component-Specific Colors**

### **Header/Navigation**

- **Background**: `#0D0D0D/90` (Obsidian with 90% opacity + backdrop blur)
- **Border**: `#444444` (Darker Grey)

### **Progress Bar**

- **Track Background**: `#2A2A2A` (Medium Charcoal)
- **Progress Fill**: Secondary Gradient (`#2563EB` to `#14B8A6`)

### **Buttons**

- **Primary Action**: Primary Gradient (`#9333EA` to `#DB2777`)
- **Secondary Action**: Secondary Gradient (`#2563EB` to `#14B8A6`)
- **Outline Button**: Transparent background with `#666666` border.
- **Disabled Button**: `#A3A3A3` (Cool Grey)

### **Form Elements**

- **Input Background**: `#1A1A1A` (Dark Charcoal)
- **Input Border**: `#666666` (Dark Grey)
- **Input Focus**: `#2563EB` (Royal Blue) for border and ring.
- **Checkbox/Radio**: `#2563EB` (Royal Blue) when checked.

### **Question Type Badges**

- **Background**: Primary Gradient (`#9333EA` to `#DB2777`)
- **Text**: `white`

### **Results Screen**

- **Score Text**: Secondary Gradient (`#2563EB` to `#14B8A6`) as text gradient.
- **Title Text**: Primary Gradient (`#9333EA` to `#DB2777`) as text gradient.

## **Accessibility & Contrast**

- **High Contrast Pairs**:
  - `#F5F5F5` text on `#1A1A1A` background
  - `#F5F5F5` text on `#2A2A2A` background
  - White text on gradient backgrounds
- **Medium Contrast**: `#CCCCCC` text for secondary information.
- **Interactive Feedback**: Clear visual distinction between normal, hover, and selected states.