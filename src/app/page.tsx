import {
  GeneratorCard,
  GeneratorForm,
  GeneratorFrame,
  GeneratorHeader,
  GeneratorLoader,
  GeneratorProvider,
  GeneratorResult,
} from '@/components/Generator';

export default function Home() {
  return (
    <GeneratorProvider>
      <GeneratorFrame>
        <GeneratorHeader />

        <GeneratorCard>
          <GeneratorForm />

          <GeneratorLoader />

          <GeneratorResult />
        </GeneratorCard>
      </GeneratorFrame>
    </GeneratorProvider>
  );
}
