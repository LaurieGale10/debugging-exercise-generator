import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedExerciseViewComponent } from './generated-exercise-view.component';

describe('GeneratedExerciseViewComponent', () => {
  let component: GeneratedExerciseViewComponent;
  let fixture: ComponentFixture<GeneratedExerciseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratedExerciseViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneratedExerciseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
