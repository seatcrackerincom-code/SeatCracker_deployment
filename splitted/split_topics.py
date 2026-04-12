#!/usr/bin/env python3
"""
EAMCET QUESTION SPLITTER - Complete Automation
Automatically splits ALL questions into topic-wise JSON files
Run from command line: python split_topics.py
Place all JSON files in same folder as this script
"""

import json
import os
import re
from pathlib import Path


class EAMCETSplitter:
    def __init__(self):
        # Get script directory (where user keeps all files)
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.output_base = os.path.join(self.script_dir, 'questions')
        self.results = {}
        
    def normalize_filename(self, name):
        """Convert topic name to lowercase filename with underscores"""
        name = name.lower()
        name = re.sub(r'[^a-z0-9]+', '_', name)
        name = name.strip('_')
        return name
    
    def create_output_folders(self):
        """Create output folder structure"""
        subjects = ['maths', 'physics', 'chemistry', 'botany', 'zoology']
        for subject in subjects:
            folder = os.path.join(self.output_base, subject)
            os.makedirs(folder, exist_ok=True)
        print(f"✓ Output folder created: {self.output_base}\n")
    
    def process_maths(self):
        """Process maths.json - split into topic files"""
        input_file = os.path.join(self.script_dir, 'maths.json')
        if not os.path.exists(input_file):
            print("✗ maths.json not found!")
            return
        
        print("=" * 80)
        print("PROCESSING: MATHEMATICS")
        print("=" * 80)
        
        with open(input_file, 'r', encoding='utf-8') as f:
            topics_list = json.load(f)
        
        output_folder = os.path.join(self.output_base, 'maths')
        count = 0
        total_questions = 0
        
        for topic_data in topics_list:
            topic_name = topic_data.get('topic_name', 'Unknown')
            questions = topic_data.get('questions', [])
            
            if not questions:
                continue
            
            # Create filename
            filename = self.normalize_filename(topic_name)
            filepath = os.path.join(output_folder, f'{filename}.json')
            
            # Create output with all original data
            output_data = {
                'topic_id': topic_data.get('topic_id'),
                'topic_name': topic_name,
                'weightage': topic_data.get('weightage'),
                'priority': topic_data.get('priority'),
                'subtopics': topic_data.get('subtopics', []),
                'questions': questions
            }
            
            # Write to file
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            
            count += 1
            total_questions += len(questions)
            print(f"  ✓ {filename}.json ({len(questions)} questions)")
        
        self.results['maths'] = {'topics': count, 'questions': total_questions}
        print(f"\nMathematics: {count} topics, {total_questions} questions\n")
    
    def process_physics(self):
        """Process physics.json - split into topic files"""
        input_file = os.path.join(self.script_dir, 'physics.json')
        if not os.path.exists(input_file):
            print("✗ physics.json not found!")
            return
        
        print("=" * 80)
        print("PROCESSING: PHYSICS")
        print("=" * 80)
        
        with open(input_file, 'r', encoding='utf-8') as f:
            topics_list = json.load(f)
        
        output_folder = os.path.join(self.output_base, 'physics')
        count = 0
        total_questions = 0
        
        for topic_data in topics_list:
            topic_name = topic_data.get('topic_name', 'Unknown')
            questions = topic_data.get('questions', [])
            
            if not questions:
                continue
            
            filename = self.normalize_filename(topic_name)
            filepath = os.path.join(output_folder, f'{filename}.json')
            
            output_data = {
                'topic_id': topic_data.get('topic_id'),
                'topic_name': topic_name,
                'weightage': topic_data.get('weightage'),
                'priority': topic_data.get('priority'),
                'subtopics': topic_data.get('subtopics', []),
                'questions': questions
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            
            count += 1
            total_questions += len(questions)
            print(f"  ✓ {filename}.json ({len(questions)} questions)")
        
        self.results['physics'] = {'topics': count, 'questions': total_questions}
        print(f"\nPhysics: {count} topics, {total_questions} questions\n")
    
    def process_chemistry(self):
        """Process chemistry.json - split into topic files"""
        input_file = os.path.join(self.script_dir, 'chemistry.json')
        if not os.path.exists(input_file):
            print("✗ chemistry.json not found!")
            return
        
        print("=" * 80)
        print("PROCESSING: CHEMISTRY")
        print("=" * 80)
        
        with open(input_file, 'r', encoding='utf-8') as f:
            topics_list = json.load(f)
        
        output_folder = os.path.join(self.output_base, 'chemistry')
        count = 0
        total_questions = 0
        
        for topic_data in topics_list:
            topic_name = topic_data.get('topic_name', 'Unknown')
            questions = topic_data.get('questions', [])
            
            if not questions:
                continue
            
            filename = self.normalize_filename(topic_name)
            filepath = os.path.join(output_folder, f'{filename}.json')
            
            output_data = {
                'topic_id': topic_data.get('topic_id'),
                'topic_name': topic_name,
                'weightage': topic_data.get('weightage'),
                'priority': topic_data.get('priority'),
                'subtopics': topic_data.get('subtopics', []),
                'questions': questions
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            
            count += 1
            total_questions += len(questions)
            print(f"  ✓ {filename}.json ({len(questions)} questions)")
        
        self.results['chemistry'] = {'topics': count, 'questions': total_questions}
        print(f"\nChemistry: {count} topics, {total_questions} questions\n")
    
    def process_botany(self):
        """Process botany.json - split into topic files"""
        input_file = os.path.join(self.script_dir, 'botany.json')
        if not os.path.exists(input_file):
            print("✗ botany.json not found!")
            return
        
        print("=" * 80)
        print("PROCESSING: BOTANY")
        print("=" * 80)
        
        with open(input_file, 'r', encoding='utf-8') as f:
            topics_list = json.load(f)
        
        output_folder = os.path.join(self.output_base, 'botany')
        count = 0
        total_questions = 0
        
        for topic_data in topics_list:
            topic_name = topic_data.get('topic_name', 'Unknown')
            questions = topic_data.get('questions', [])
            
            if not questions:
                continue
            
            filename = self.normalize_filename(topic_name)
            filepath = os.path.join(output_folder, f'{filename}.json')
            
            output_data = {
                'topic_id': topic_data.get('topic_id'),
                'topic_name': topic_name,
                'weightage': topic_data.get('weightage'),
                'priority': topic_data.get('priority'),
                'subtopics': topic_data.get('subtopics', []),
                'questions': questions
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            
            count += 1
            total_questions += len(questions)
            print(f"  ✓ {filename}.json ({len(questions)} questions)")
        
        self.results['botany'] = {'topics': count, 'questions': total_questions}
        print(f"\nBotany: {count} topics, {total_questions} questions\n")
    
    def process_zoology(self):
        """Process Zoology.json - split into topic files (different structure)"""
        input_file = os.path.join(self.script_dir, 'Zoology.json')
        if not os.path.exists(input_file):
            print("✗ Zoology.json not found!")
            return
        
        print("=" * 80)
        print("PROCESSING: ZOOLOGY")
        print("=" * 80)
        
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Zoology has different structure
        topics_list = data.get('topics', [])
        
        output_folder = os.path.join(self.output_base, 'zoology')
        count = 0
        total_questions = 0
        
        for topic_data in topics_list:
            topic_name = topic_data.get('topic_name', 'Unknown')
            questions = topic_data.get('questions', [])
            
            if not questions:
                continue
            
            filename = self.normalize_filename(topic_name)
            filepath = os.path.join(output_folder, f'{filename}.json')
            
            output_data = {
                'topic_id': topic_data.get('topic_id'),
                'topic_name': topic_name,
                'weightage': topic_data.get('weightage'),
                'priority': topic_data.get('priority'),
                'subtopics': topic_data.get('subtopics', []),
                'questions': questions
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            
            count += 1
            total_questions += len(questions)
            print(f"  ✓ {filename}.json ({len(questions)} questions)")
        
        self.results['zoology'] = {'topics': count, 'questions': total_questions}
        print(f"\nZoology: {count} topics, {total_questions} questions\n")
    
    def print_summary(self):
        """Print final summary"""
        print("\n" + "=" * 80)
        print("FINAL SUMMARY")
        print("=" * 80 + "\n")
        
        total_topics = 0
        total_questions = 0
        
        subjects_order = ['maths', 'physics', 'chemistry', 'botany', 'zoology']
        
        for subject in subjects_order:
            if subject in self.results:
                data = self.results[subject]
                topics = data['topics']
                questions = data['questions']
                total_topics += topics
                total_questions += questions
                print(f"{subject.upper():12} → {topics:3} topics | {questions:5} questions")
        
        print(f"\n{'-' * 80}")
        print(f"{'TOTAL':12} → {total_topics:3} topics | {total_questions:5} questions")
        print("=" * 80)
        print(f"\n✓ ALL FILES CREATED IN: {self.output_base}\n")
    
    def run(self):
        """Execute complete splitting process"""
        print("\n" + "=" * 80)
        print("EAMCET QUESTION SPLITTER v2.0")
        print("=" * 80)
        print(f"\nScript location: {self.script_dir}")
        print(f"Output location: {self.output_base}\n")
        
        # Create output folders
        self.create_output_folders()
        
        # Process all subjects
        self.process_maths()
        self.process_physics()
        self.process_chemistry()
        self.process_botany()
        self.process_zoology()
        
        # Print summary
        self.print_summary()


def main():
    """Main entry point"""
    try:
        splitter = EAMCETSplitter()
        splitter.run()
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        print("\nMake sure all JSON files are in the same folder as this script:")
        print("  - maths.json")
        print("  - physics.json")
        print("  - chemistry.json")
        print("  - botany.json")
        print("  - Zoology.json")


if __name__ == '__main__':
    main()
