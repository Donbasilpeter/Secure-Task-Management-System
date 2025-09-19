import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LandingPageComponent } from './landing-page.component';
import { By } from '@angular/platform-browser';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct app name in header', () => {
    const header = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.textContent).toContain(component.appStore.appName());
  });

  it('should render all features', () => {
    const featureEls = fixture.debugElement.queryAll(By.css('section > div'));
    expect(featureEls.length).toBe(component.appStore.features().length);
  });

  it('should display feature titles and descriptions correctly', () => {
    const featureEls = fixture.debugElement.queryAll(By.css('section > div'));
    featureEls.forEach((el, index) => {
      const title = el.query(By.css('h2')).nativeElement.textContent.trim();
      const description = el.query(By.css('p')).nativeElement.textContent.trim();

      expect(title).toBe(component.appStore.features()[index].title);
      expect(description).toBe(component.appStore.features()[index].description);
    });
  });

  it('should have a "Get Started" button with routerLink="register"', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="register"]')).nativeElement;
    expect(link.textContent).toContain('Get Started');
  });

  it('should have a "Login here" link with routerLink="login"', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="login"]')).nativeElement;
    expect(link.textContent).toContain('Login here');
  });

  it('should render footer with app name and year', () => {
    const footer = fixture.debugElement.query(By.css('footer')).nativeElement.textContent;
    expect(footer).toContain(`© 2025 ${component.appStore.appName()}`);
  });
});
