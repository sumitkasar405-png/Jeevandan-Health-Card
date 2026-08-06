import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements AfterViewInit, OnDestroy {
  private toastTimer: ReturnType<typeof setTimeout> | undefined;
  private cleanupFns: Array<() => void> = [];

  ngAfterViewInit(): void {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    const showToast = (msg: string, isError?: boolean): void => {
      if (!toast || !toastMsg) return;
      toastMsg.textContent = msg;
      toast.classList.toggle('error', !!isError);
      const icon = toast.querySelector('i');
      if (icon) {
        icon.className = isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
      }
      toast.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
    };

    /* ---------- Stepper: click a step to scroll to its section ---------- */
    const steps = Array.from(document.querySelectorAll<HTMLElement>('.step'));
    const lines = Array.from(document.querySelectorAll<HTMLElement>('.step-line'));
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.form-card[data-section]'));

    const setActiveStep = (stepNum: number): void => {
      steps.forEach((s) => {
        const n = parseInt(s.dataset['step'] ?? '0', 10);
        s.classList.toggle('active', n === stepNum);
        s.classList.toggle('done', n < stepNum);
      });
      lines.forEach((l, i) => l.classList.toggle('done', i < stepNum - 1));
    };

    steps.forEach((stepBtn) => {
      const handler = (): void => {
        const num = parseInt(stepBtn.dataset['step'] ?? '0', 10);
        // steps 1-4 map to the four sections; step 5 (Review) scrolls to the footer
        const target: HTMLElement | null = num <= 4 ? (sections[num - 1] ?? null) : document.querySelector('.form-footer');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveStep(num);
      };
      stepBtn.addEventListener('click', handler);
      this.cleanupFns.push(() => stepBtn.removeEventListener('click', handler));
    });

    // Highlight the step in view while scrolling
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = sections.indexOf(entry.target as HTMLElement);
              if (idx !== -1) setActiveStep(idx + 1);
            }
          });
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      sections.forEach((sec) => observer.observe(sec));
      this.cleanupFns.push(() => observer.disconnect());
    }

    /* ---------- Driver photo upload (image preview, delegated so it survives re-render) ---------- */
    const driverPhotoLabel = document.querySelector<HTMLLabelElement>('.upload-photo');
    if (driverPhotoLabel) {
      const handler = (e: Event): void => {
        const target = e.target as HTMLElement;
        if (!target.matches('input[type="file"]')) return;
        const input = target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          showToast('Driver photo must be under 2MB', true);
          input.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = (ev: ProgressEvent<FileReader>): void => {
          driverPhotoLabel.classList.add('has-file');
          driverPhotoLabel.innerHTML =
            '<img src="' + (ev.target?.result ?? '') + '" alt="Driver photo preview">' +
            '<input id="driverPhoto" type="file" accept="image/png,image/jpeg">';
          showToast('Driver photo uploaded');
        };
        reader.readAsDataURL(file);
      };
      driverPhotoLabel.addEventListener('change', handler);
      this.cleanupFns.push(() => driverPhotoLabel.removeEventListener('change', handler));
    }

    /* ---------- Capability checkboxes ---------- */
    const capLabels = Array.from(document.querySelectorAll<HTMLLabelElement>('.capability'));
    capLabels.forEach((label) => {
      const box = label.querySelector<HTMLInputElement>('input');
      const handler = (): void => {
        // allow native checkbox toggling, just sync the visual state after
        setTimeout(() => {
          if (box) label.classList.toggle('checked', box.checked);
        }, 0);
      };
      label.addEventListener('click', handler);
      this.cleanupFns.push(() => label.removeEventListener('click', handler));
    });

    /* ---------- Document upload slots ---------- */
    const docSlots = Array.from(document.querySelectorAll<HTMLElement>('.doc-slot'));
    docSlots.forEach((slot) => {
      const btn = slot.querySelector<HTMLButtonElement>('.doc-trigger');
      const input = slot.querySelector<HTMLInputElement>('input[type="file"]');
      if (!btn || !input) return;

      const clickHandler = (): void => input.click();
      btn.addEventListener('click', clickHandler);
      this.cleanupFns.push(() => btn.removeEventListener('click', clickHandler));

      const changeHandler = (): void => {
        const file = input.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          showToast('File must be under 5MB', true);
          input.value = '';
          return;
        }
        slot.classList.add('uploaded');
        btn.innerHTML = '<i class="fa-solid fa-check"></i>Uploaded';
        let existing = slot.querySelector<HTMLElement>('.filename');
        if (!existing) {
          existing = document.createElement('small');
          existing.className = 'filename';
          slot.appendChild(existing);
        }
        existing.textContent = file.name;
        const nameEl = slot.querySelector('.name');
        showToast((nameEl?.textContent ?? '').replace('*', '').trim() + ' uploaded');
      };
      input.addEventListener('change', changeHandler);
      this.cleanupFns.push(() => input.removeEventListener('change', changeHandler));
    });

    /* ---------- Cancel button ---------- */
    const form = document.getElementById('ambulanceForm') as HTMLFormElement | null;
    const cancelBtn = document.getElementById('cancelBtn');

    if (cancelBtn && form) {
      const cancelHandler = (): void => {
        if (confirm('Discard all entered details and reset the form?')) {
          form.reset();
          capLabels.forEach((l) => l.classList.remove('checked'));
          docSlots.forEach((slot) => {
            slot.classList.remove('uploaded');
            const trigger = slot.querySelector('.doc-trigger');
            if (trigger) trigger.innerHTML = '<i class="fa-solid fa-upload"></i>Upload File';
            const f = slot.querySelector('.filename');
            f?.remove();
          });
          if (driverPhotoLabel) {
            driverPhotoLabel.classList.remove('has-file');
            driverPhotoLabel.innerHTML =
              '<i class="fa-solid fa-file-image"></i><strong>Click to upload photo</strong>' +
              '<small>JPG, PNG (Max. 2MB)</small>' +
              '<input id="driverPhoto" type="file" accept="image/png,image/jpeg">';
          }
          setActiveStep(1);
          showToast('Form reset');
        }
      };
      cancelBtn.addEventListener('click', cancelHandler);
      this.cleanupFns.push(() => cancelBtn.removeEventListener('click', cancelHandler));
    }

    if (form) {
      /* ---------- Save & Next: validate required fields ---------- */
      const submitHandler = (e: SubmitEvent): void => {
        e.preventDefault();
        const invalidFields: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = [];

        Array.from(
          form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]')
        ).forEach((el) => {
          const fieldWrap = el.closest('.field');
          const valid = el instanceof HTMLInputElement && el.type === 'checkbox'
            ? el.checked
            : el.value.trim() !== '';
          fieldWrap?.classList.toggle('invalid', !valid);
          if (!valid) invalidFields.push(el);
        });

        const agree = document.getElementById('agreeTerms') as HTMLInputElement | null;
        const termsOk = !!agree?.checked;
        if (agree?.parentElement) {
          agree.parentElement.style.color = termsOk ? '' : '#d73950';
        }

        if (invalidFields.length || !termsOk) {
          showToast('Please fill all required fields marked *', true);
          const firstInvalid = invalidFields[0];
          firstInvalid?.closest('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        showToast('Section saved — moving to next step');
        const current = steps.find((s) => s.classList.contains('active'));
        const currentNum = current ? parseInt(current.dataset['step'] ?? '1', 10) : 1;
        const nextNum = Math.min(currentNum + 1, 5);
        setActiveStep(nextNum);
        const target: HTMLElement | null = nextNum <= 4 ? (sections[nextNum - 1] ?? null) : document.querySelector('.form-footer');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      form.addEventListener('submit', submitHandler as EventListener);
      this.cleanupFns.push(() => form.removeEventListener('submit', submitHandler as EventListener));

      // Clear the invalid highlight as soon as the user fixes a field
      const clearInvalid = (e: Event): void => {
        const fieldWrap = (e.target as HTMLElement)?.closest('.field');
        fieldWrap?.classList.remove('invalid');
      };
      form.addEventListener('input', clearInvalid);
      form.addEventListener('change', clearInvalid);
      this.cleanupFns.push(() => {
        form.removeEventListener('input', clearInvalid);
        form.removeEventListener('change', clearInvalid);
      });

      /* ---------- Select styling: mark filled selects ---------- */
      Array.from(form.querySelectorAll<HTMLSelectElement>('select')).forEach((sel) => {
        const handler = (): void => { sel.classList.toggle('filled', sel.value !== ''); };
        sel.addEventListener('change', handler);
        this.cleanupFns.push(() => sel.removeEventListener('change', handler));
      });
    }

    /* ---------- Misc buttons ---------- */
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      const handler = (): void => showToast('Login page would open here');
      loginBtn.addEventListener('click', handler);
      this.cleanupFns.push(() => loginBtn.removeEventListener('click', handler));
    }

    const contactSupportBtn = document.getElementById('contactSupportBtn');
    if (contactSupportBtn) {
      const handler = (): void => showToast('Connecting you to support…');
      contactSupportBtn.addEventListener('click', handler);
      this.cleanupFns.push(() => contactSupportBtn.removeEventListener('click', handler));
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }
}
